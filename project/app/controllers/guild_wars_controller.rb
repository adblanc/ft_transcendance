class WarsController < ApplicationController

	def index
		@guildwars = GuildWar.all
	end

end
