class War < ApplicationRecord
	has_many :guild_wars
	has_many :guilds, through: :guild_wars, source: :guild, foreign_key: :guild_id, dependent: :destroy

	has_many :war_times

	enum status: [
		:pending,
		:confirmed,
		:started,
		:ended,
	]

	validates :start, presence: true
	validates :end, presence: true
	validates :prize, presence: true
end
