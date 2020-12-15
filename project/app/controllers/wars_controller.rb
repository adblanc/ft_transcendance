class WarsController < ApplicationController
	def create
		@initiator = Guild.find(params[:guild_id])
		@recipient = Guild.find(params[:opponent_id])

		@war = War.create!(war_params)
		GuildWar.create!(guild: @initiator, war: @war, status: :accepted)
		GuildWar.create!(guild: @recipient, war: @war, status: :pending)

		/Notif/
	end

	private

	def war_params
		params.permit( :start, :end, :prize)
	end

end
