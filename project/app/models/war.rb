class War < ApplicationRecord
	has_many :guild_wars
	has_many :guilds, through :guild_wars
	has_many :war_times

	validates :start, presence: true
	validates :end, presence: true
	validates :prize, presence: true
end
