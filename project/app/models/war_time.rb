class WarTime < ApplicationRecord
	belongs_to :war

	enum status: [
		:active,
		:inactive,
	]

	validates :end, presence: true
	validate :date_check

	def date_check
		if self.end < war.start || self.end > war.end
			errors.add(:end, 'must be set within the time frame of the war')
		end
	end
end
