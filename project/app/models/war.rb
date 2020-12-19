class War < ApplicationRecord
	has_many :guild_wars
	has_many :guilds, through: :guild_wars, source: :guild, foreign_key: :guild_id, dependent: :destroy
	accepts_nested_attributes_for :guilds

	has_many :war_times

	enum status: [
		:pending,
		:confirmed,
		:started,
		:ended,
	]

	validates :start, presence: true
	validates :end, presence: true
	validates :prize, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 1 }
	validates_with WarDateValidator	
	/validates_each :guilds do |record, attr, value|
		if value.points < record.prize
		  record.errors.add :base, "One or both Guilds cannot wager that many points"
		end
	end/

	def initiator
		if self.pending?
			self.guild_wars.accepted.first.guild
		end
	end
end
