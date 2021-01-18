class Game < ApplicationRecord
	has_many :game_users
	has_and_belongs_to_many :users, through: :game_user
	belongs_to :war_time, optional: true

	enum status: [
		:pending,
		:started,
		:finished,
		:unanswered
	]

	enum game_type: [
		:friendly,
		:ladder,
		:war_time,
		:tournament
	]

    validates :level,  presence: true
	validates :goal, presence: true

	def finish
		logger.debug "test"
	end
		
end
