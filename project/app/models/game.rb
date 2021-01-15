class Game < ApplicationRecord
	resourcify
		has_many :game_users
		has_and_belongs_to_many :users, through: :game_user

		enum status: [
			:pending,
			:started,
			:finished,
			:unanswered,
		]

        validates :level,  presence: true
		validates :goal, presence: true

		def finish
			/stop tout/
		end
		
end
