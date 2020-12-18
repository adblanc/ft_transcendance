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

		GuildWar.create!(guild: @initiator, war: @war, status: :accepted)
		GuildWar.create!(guild: @recipient, war: @war, status: :pending)

		if @war.save
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

		@guild_war.accepted!
		@war.confirmed!

		@guild.guild_wars.each do |guild_war|
			guild_war.destroy unless @guild_war
		end

		/Start Jobs/

	end


	private

	def war_params
		params.permit( :start, :end, :prize)
	end

end
