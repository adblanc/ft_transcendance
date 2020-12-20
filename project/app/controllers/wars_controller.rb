class WarsController < ApplicationController

	def index
		@wars = War.all
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
				war.destroy unless war == @war
			end
			@war
		else
			render json: @war.errors, status: :unprocessable_entity
		end

		/Notif/
	end

	def accept
		@war = War.find_by_id(params[:id])
		@guild = Guild.find_by_id(current_user.guild.id)
		@guild_war = GuildWar.where(war: @war, guild: @guild).first

		@guild_war.update(status: :accepted)
		@war.update(status: :confirmed)

		@guild.wars.where(status: :pending).each do |war|
			war.destroy
		end

		if @war.save
			@war
		end
		/Notif for acceptance and refusal for others/

		/Start Jobs/
	end

	def reject
		@war = War.find_by_id(params[:id])
		@war.destroy
	end

	def update
		@war = War.find_by_id(params[:id])
		@guild = Guild.find_by_id(current_user.guild.id)
		@gw_initiator = GuildWar.where(war: @war, guild: @guild).first
		@gw_recipient = GuildWar.where(war: @war).where.not(guild: @guild).first

		@war.update(guild_params)
		if @war.save
			@gw_initiator.update(status: :accepted)
			@gw_recipient.update(status: :pending)
			@guild.wars.where(status: :pending).each do |war|
				war.destroy
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
