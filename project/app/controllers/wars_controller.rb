class WarsController < ApplicationController

	def index
		@wars = War.where(status: :started)
	end

	def show
		@war = War.find_by_id(params[:id])
		return head :not_found unless @war
	end

	def create
		@initiator = Guild.find(params[:initiator_id])
		@recipient = Guild.find(params[:recipient_id])

		return head :unauthorized unless current_user.guild_owner?(@initiator)
		return head :unauthorized if @initiator.atWar? || @initiator.warInitiator? || @recipient.atWar?

		@war = War.create(war_params)

		if @war.save
			GuildWar.create!(guild: @initiator, war: @war, status: :accepted)
			GuildWar.create!(guild: @recipient, war: @war, status: :pending)
			@initiator.wars.where(status: :pending).each do |war|
				if war != @war
					war.opponent(@initiator).members.each do |member|
						member.send_notification("#{@initiator.name} rejected your guild's war declaration", "/wars", "war")
					end
					war.destroy
				end
			end
			@recipient.members.each do |member|
				member.send_notification("#{@initiator.name} has declared war to your Guild", "/wars", "war")
			end
			@initiator.members.each do |member|
				member.send_notification("Your guild has declared war to #{@recipient.name}", "/wars", "war")
			end
			@war
		else
			render json: @war.errors, status: :unprocessable_entity
		end
	end

	def accept
		@war = War.find_by_id(params[:id])
		@guild = Guild.find_by_id(current_user.guild.id)
		@opponent = @war.opponent(@guild)
		@guild_war = GuildWar.where(war: @war, guild: @guild).first

		return head :unauthorized unless current_user.guild_owner?(@guild) || current_user.guild_officer?(@guild)
		return head :unauthorized if @guild.atWar? || @guild.warInitiator? || @opponent.atWar?

		@guild_war.update(status: :accepted)
		@war.update(status: :confirmed)

		@guild.wars.where(status: :pending).each do |war|
			war.opponent(@guild).members.each do |member|
				member.send_notification("#{@guild.name} rejected your guild's war declaration", "/wars", "war")
			end
			war.destroy
		end

		if @war.save
			@war
		end

		@opponent.members.each do |member|
			member.send_notification("#{@guild.name} has accepted your guild's war declaration", "/wars", "war")
		end

		StartWarJob.set(wait_until: @war.start).perform_later(@war)
		EndWarJob.set(wait_until: @war.end).perform_later(@war)
	end

	def reject
		@war = War.find_by_id(params[:id])
		@guild = Guild.find_by_id(current_user.guild.id)

		return head :unauthorized unless current_user.guild_owner?(@guild) || current_user.guild_officer?(@guild)
		return head :unauthorized if @guild.atWar? || @guild.warInitiator?

		@war.opponent(@guild).members.each do |member|
			member.send_notification("#{@guild.name} rejected your guild's war declaration", "/wars", "war")
		end
		@war.destroy
	end

	def update
		@war = War.find_by_id(params[:id])
		@guild = Guild.find_by_id(current_user.guild.id)
		@opponent = @war.opponent(@guild)
		@gw_initiator = GuildWar.where(war: @war, guild: @guild).first
		@gw_recipient = GuildWar.where(war: @war).where.not(guild: @guild).first

		return head :unauthorized unless current_user.guild_owner?(@guild) || current_user.guild_officer?(@guild)
		return head :unauthorized if @guild.atWar? || @guild.warInitiator? || @opponent.atWar?

		@war.update(war_params)
		if @war.save
			@gw_initiator.update(status: :accepted)
			@gw_recipient.update(status: :pending)
			@guild.wars.where(status: :pending).each do |war|
				if war != @war
					war.opponent(@guild).members.each do |member|
						member.send_notification("#{@guild.name} rejected your guild's war declaration", "/wars", "war")
					end
					war.destroy
				end
			end
			@opponent.members.each do |member|
				member.send_notification("#{@guild.name} has negotiated the terms of your guild's war declaration", "/wars", "war")
			end
			@war
		else
			render json: @war.errors, status: :unprocessable_entity
		end
	end

	def activateWarTime
		@war = War.find_by_id(params[:id])
		@guild = Guild.find_by_id(current_user.guild.id)
		@opponent = @war.opponent(@guild)

		return head :unauthorized if not @guild.atWar? || @opponent.atWar?
		return head :unauthorized if @war.atWarTime?

		@war_time = WarTime.create(war: @war, start: DateTime.now, end: params[:end], time_to_answer: @war.time_to_answer, max_unanswered_calls: @war.max_unanswered_calls)

		if @war_time.save
			@guild.members.each do |member|
				member.send_notification("War time has just started with #{@opponent.name}! Take your slots!", "/wars", "war")
			end
			@opponent.members.each do |member|
				member.send_notification("War time has just started with #{@guild.name}! Take your slots!", "/wars", "war")
			end
			EndWarTimeJob.set(wait_until: @war_time.end).perform_later(@war_time, @war)
		else
			render json: @war_time.errors, status: :unprocessable_entity
		end
	end

	def challenge
		@war = War.find_by_id(params[:id])
		@warTime = @war.activeWarTime
		@guild = Guild.find_by_id(current_user.guild.id)
		@opponent = @war.opponent(@guild)

		return head :unauthorized if not @guild.atWar? || @opponent.atWar? || @war.atWarTime?

		@game = Game.create(game_params)
		@game.update(war_time: @warTime)

		if @game.save
			@game.users.push(current_user)
			@opponent.members.each do |member|
				member.send_notification("#{current_user.name} has challenged your guild to a war time match! Answer the call!", "/wars", "war")
			end
			ExpireWarTimeGameJob.set(wait_until: DateTime.now + @war.time_to_answer.minutes).perform_later(@game, @guild, @opponent, @warTime, current_user)
		else
			render json: @game.errors, status: :unprocessable_entity
		end
	end

	private

	def war_params
		params.permit( :start, :end, :prize, :time_to_answer, :max_unanswered_calls, :inc_tour)
	end
	def game_params
        params.permit(:level, :goal, :game_type)
    end

end
