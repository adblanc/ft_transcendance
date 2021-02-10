class WarTime < ApplicationRecord
	belongs_to :war
	has_many :games

	enum status: [
		:active,
		:inactive,
	]

	validates :end, presence: true
	validate :date_check

	def date_check
		if self.end.present?
			if self.end < war.start || self.end > war.end
				errors.add :end, 'must be set within the time frame of the war'
			end
			if self.end - self.start < 1
				errors.add :wartime, 'cannot end right now'
			end
		end
	end

	def activeGame
		if games.where(status: [:started]).first
			games.where(status: [:started]).first
		elsif games.where(status: [:matched]).first
			games.where(status: [:matched]).first
		end
	end

	def pendingGame
		games.where(status: [:pending]).first
	end

	def pendingGameInitiator
		games.where(status: [:pending]).first.users.first
	end

	def pendingGameGuildInitiator
		games.where(status: [:pending]).first.users.first.guild
	end
end
