class WarTime < ApplicationRecord
	belongs_to :war, :validate => false
	has_many :games

	enum status: [
		:inactive,
		:active,
	]

	validates :start, presence: true
	validates :end, presence: true
	validate :date_check

	def my_logger
		@@my_logger ||= Logger.new("#{Rails.root}/log/my.log")
	end	

	def date_check
		my_logger.info("call date check")
		if self.start.present? && self.end.present?
			if self.end < self.start
				errors.add :dates, ": war times end date cannot be before start date"
			end
			if self.end == self.start
				errors.add :dates, ": war times start time and end time must be different"
			end
			if self.start < war.start || self.start > war.end || self.end < war.start || self.end > war.end
				errors.add :wartime, 'must be set within the time frame of the war'
			end
			self.check_overlap
		end
	end

	def check_overlap
		@wartimes = WarTime.where(war: war)
		/@wartimes.each do | wt |/
		for wt in @wartimes
			my_logger.info("enter")
			if not self.start < wt.start && self.end < wt.start
				my_logger.info("condition 1")
				if self.start <= wt.end
					my_logger.info("condition 2")
					errors.add :wartimes, 'cannot overlap'
				end
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
