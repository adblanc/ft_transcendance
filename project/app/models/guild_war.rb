class GuildWar < ApplicationRecord
	belongs_to :war
	belongs_to :guild 
	/each will have a guild_war with own points/

	enum status: [
		:pending,
		:accepted,
	]

	def score(points)
		increment!(:points, points)
	end
end
