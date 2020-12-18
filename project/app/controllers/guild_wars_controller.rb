class GuildWarsController < ApplicationController

	def index
		@guildwars = GuildWar.all
	end

	def show
		@guildwar = GuildWar.find_by_id(params[:id])
		return head :not_found unless @guildwar
	end

	def destroy
		@guildwar = GuildWar.find_by_id(params[:id])
		@guildwar.destroy
	end

end
