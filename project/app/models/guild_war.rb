class GuildWar < ApplicationRecord
	belongs_to :war
	belongs_to :guild 
	/will be the one to declare war/
end
