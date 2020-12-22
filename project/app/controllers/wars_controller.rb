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

		@war = War.create(war_params)

		if @war.save
			GuildWar.create!(guild: @initiator, war: @war, status: :accepted)
			GuildWar.create!(guild: @recipient, war: @war, status: :pending)
			@initiator.wars.where(status: :pending).each do |war|
				if war != @war
					war.opponent(@initiator).members do |member|
						member.send_notification("#{@initiator.name} rejected your guild's war declaration", "/warindex")
					end
					war.destroy
				end
			end
			@recipient.members.each do |member|
				member.send_notification("#{@initiator.name} has declared war to your Guild", "/warindex")
			end
			@initiator.members.each do |member|
				member.send_notification("Your guild has declared war to #{@recipient.name}", "/warindex")
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

		@guild_war.update(status: :accepted)
		@war.update(status: :confirmed)

		@guild.wars.where(status: :pending).each do |war|
			war.opponent(@guild).members do |member|
				member.send_notification("#{@guild.name} rejected your guild's war declaration", "/warindex")
			end
			war.destroy
		end

		if @war.save
			@war
		end

		@opponent.members.each do |member|
			member.send_notification("#{@guild.name} has accepted your guild's war declaration", "/warindex")
		end

		StartWarJob.set(wait_until: @war.start).perform_later(@war)
		EndWarJob.set(wait_until: @war.end).perform_later(@war)
	end

	def reject
		@war = War.find_by_id(params[:id])
		@guild = Guild.find_by_id(current_user.guild.id)
		@war.opponent(@guild).members do |member|
			member.send_notification("#{@guild.name} rejected your guild's war declaration", "/warindex")
		end
		@war.destroy
	end

	def update
		@war = War.find_by_id(params[:id])
		@guild = Guild.find_by_id(current_user.guild.id)
		@opponent = @war.opponent(@guild)
		@gw_initiator = GuildWar.where(war: @war, guild: @guild).first
		@gw_recipient = GuildWar.where(war: @war).where.not(guild: @guild).first

		@war.update(war_params)
		if @war.save
			@gw_initiator.update(status: :accepted)
			@gw_recipient.update(status: :pending)
			@guild.wars.where(status: :pending).each do |war|
				if war != @war
					war.opponent(@guild).members do |member|
						member.send_notification("#{@guild.name} rejected your guild's war declaration", "/warindex")
					end
					war.destroy
				end
				@opponent.members.each do |member|
					member.send_notification("#{@guild.name} has negotiated the terms of your guild's war declaration", "/warindex")
				end
			end
			@war
		else
			render json: @war.errors, status: :unprocessable_entity
		end

	end

	private

	def war_params
		params.permit( :start, :end, :prize)
	end

end
