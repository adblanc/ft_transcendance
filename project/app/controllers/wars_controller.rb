class WarsController < ApplicationController
	before_action :authenticate_user!

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

		if @initiator.atWar? || @initiator.warInitiator? || @recipient.atWar?
			render json: {"Your" => ["guild or opponent guild is already at war"]}, status: :unprocessable_entity
			return
		end
		@war = War.create(war_params)

		if @war.save
			GuildWar.create!(guild: @initiator, war: @war, status: :accepted)
			GuildWar.create!(guild: @recipient, war: @war, status: :pending)
			@initiator.wars.where(status: :pending).each do |war|
				if war != @war
					war.opponent(@initiator).members.each do |member|
						member.send_notification("#{@initiator.name} rejected your guild's war declaration", "/wars", "wars")
					end
					war.destroy
				end
			end
			@recipient.members.each do |member|
				member.send_notification("#{@initiator.name} has declared war to your Guild", "/wars", "wars")
			end
			@initiator.members.each do |member|
				member.send_notification("Your guild has declared war to #{@recipient.name}", "/wars", "wars")
			end
			ExpireWarJob.set(wait_until: @war.end).perform_later(@war)
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

		if not current_user.guild_owner?(@guild) || current_user.guild_officer?(@guild)
			render json: {"You" => ["must be a guild owner or officer to do this"]}, status: :unprocessable_entity
			return
		end

		if @guild.atWar? || @guild.warInitiator? || @opponent.atWar?
			render json: {"Your" => ["guild or opponent guild is already at war"]}, status: :unprocessable_entity
			return
		end

		@guild_war.update(status: :accepted)
		@war.update(status: :confirmed)

		@guild.wars.where(status: :pending).each do |war|
			war.opponent(@guild).members.each do |member|
				member.send_notification("#{@guild.name} rejected your guild's war declaration", "/wars", "wars")
			end
			war.destroy
		end

		if @war.save
			@war
		end

		@opponent.members.each do |member|
			member.send_notification("#{@guild.name} has accepted your guild's war declaration", "/wars", "wars")
		end

		StartWarJob.set(wait_until: @war.start).perform_later(@war)
		EndWarJob.set(wait_until: @war.end).perform_later(@war)
	end

	def reject
		@war = War.find_by_id(params[:id])
		@guild = Guild.find_by_id(current_user.guild.id)

		if not current_user.guild_owner?(@guild) || current_user.guild_officer?(@guild)
			render json: {"You" => ["must be a guild owner or officer to do this"]}, status: :unprocessable_entity
			return
		end
		return head :unauthorized if @guild.atWar? || @guild.warInitiator?

		@war.opponent(@guild).members.each do |member|
			member.send_notification("#{@guild.name} rejected your guild's war declaration", "/wars", "wars")
		end
		@war.destroy
	end

	def update
		@war = War.find_by_id(params[:id])
		@guild = Guild.find_by_id(current_user.guild.id)
		@opponent = @war.opponent(@guild)
		@gw_initiator = GuildWar.where(war: @war, guild: @guild).first
		@gw_recipient = GuildWar.where(war: @war).where.not(guild: @guild).first

		if not current_user.guild_owner?(@guild) || current_user.guild_officer?(@guild)
			render json: {"You" => ["must be a guild owner or officer to do this"]}, status: :unprocessable_entity
			return
		end
		if @guild.atWar? || @guild.warInitiator? || @opponent.atWar?
			render json: {"Your" => ["guild or opponent guild is already at war"]}, status: :unprocessable_entity
			return
		end

		@war.update(war_params)
		if @war.save
			@gw_initiator.update(status: :accepted)
			@gw_recipient.update(status: :pending)
			@guild.wars.where(status: :pending).each do |war|
				if war != @war
					war.opponent(@guild).members.each do |member|
						member.send_notification("#{@guild.name} rejected your guild's war declaration", "/wars", "wars")
					end
					war.destroy
				end
			end
			@opponent.members.each do |member|
				member.send_notification("#{@guild.name} has negotiated the terms of your guild's war declaration", "/wars", "wars")
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

		if not current_user.guild_owner?(@guild) || current_user.guild_officer?(@guild)
			render json: {"You" => ["must be a guild owner or officer to do this"]}, status: :unprocessable_entity
			return
		end

		if not @guild.atWar? || @opponent.atWar?
			render json: {"Your" => ["guild or opponent guild is not at war"]}, status: :unprocessable_entity
			return
		end

		if @war.atWarTime?
			render json: {"This" => ["war already is already in war time."]}, status: :unprocessable_entity
			return
		end

		@war_time = WarTime.create(war: @war, start: DateTime.now, end: params[:end], time_to_answer: @war.time_to_answer, max_unanswered_calls: @war.max_unanswered_calls)

		if @war_time.save
			@guild.members.each do |member|
				member.send_notification("War time has just started with #{@opponent.name}! Take your slots!", "/wars", "wars")
			end
			@opponent.members.each do |member|
				member.send_notification("War time has just started with #{@guild.name}! Take your slots!", "/wars", "wars")
			end
			EndWarTimeJob.set(wait_until: @war_time.end).perform_later(@war_time, @war)
			@war.increment!(:nb_wartimes, 1)
		else
			render json: @war_time.errors, status: :unprocessable_entity
		end
	end

	private

	def war_params
		params.permit( :start, :end, :prize, :time_to_answer, :max_unanswered_calls, :inc_ladder, :inc_tour, :inc_friendly,
		:inc_easy, :inc_normal, :inc_hard, :inc_three, :inc_six, :inc_nine)
	end

end
