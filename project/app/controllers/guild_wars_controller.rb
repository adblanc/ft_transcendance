class WarsController < ApplicationController

	def index
		@guildwars = GuildWar.all
	end

	def show
		@guildwar = War.find_by_id(params[:id])
		return head :not_found unless @guildwar
	end

end
