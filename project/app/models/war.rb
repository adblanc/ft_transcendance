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
	validates :time_to_answer, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 1 }
	validates :max_unanswered_calls, numericality: { only_integer: true, greater_than_or_equal_to: 1 }
	validates_with WarDateValidator

	def opponent(guild)
		self.guilds.where.not(id: guild.id).first
	end

	def initiator
		if self.pending?
			self.guild_wars.accepted.first.guild
		end
	end

	def atWarTime?
		self.war_times.active.present?
	end

	def activeWarTime
		WarTime.where(war: self, status: :active).first
	end

	def war_points(guild)
		GuildWar.where(war: self, guild: guild).first.points
	end

end
