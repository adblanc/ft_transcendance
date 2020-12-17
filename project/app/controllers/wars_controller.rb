class WarsController < ApplicationController

	def index
		@wars = War.all
	end

	def create
		@initiator = Guild.find(params[:initiator_id])
		@recipient = Guild.find(params[:recipient_id])

		@war = War.create(war_params)

		GuildWar.create!(guild: @initiator, war: @war, status: :accepted)
		GuildWar.create!(guild: @recipient, war: @war, status: :pending)
		/@war.guilds.push(@initiator);
		@war.guilds.push(@recipient);/

		if @war.save
			@war
		else
			render json: @war.errors, status: :unprocessable_entity
		end

		/Notif/
	end

	private

	def war_params
		params.permit( :start, :end, :prize)
	end

end
