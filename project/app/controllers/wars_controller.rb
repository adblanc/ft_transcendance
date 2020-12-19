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

		/if @initiator.points < params[:prize].to_f
			render json: "Your guild cannot wager that many points", status: :unprocessable_entity
			return
		end
		if @recipient.points < params[:prize].to_f
			render json: "Opponent guild cannot wager that many points", status: :unprocessable_entity
			return
		end/
		@war = War.create(war_params)

		if @war.save
			GuildWar.create!(guild: @initiator, war: @war, status: :accepted, opponent_id: @recipient.id)
			GuildWar.create!(guild: @recipient, war: @war, status: :pending, opponent_id: @initiator.id)
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

		if @war.save
			@war
		end

		@guild.wars.where(status: :pending).each do |war|
			war.destroy
		end
		/Notif for acceptance and refusal for others/

		/Start Jobs/
	end

	def reject
		@war = War.find_by_id(params[:id])
		@war.destroy
	end


	private

	def war_params
		params.permit( :start, :end, :prize)
	end

end
