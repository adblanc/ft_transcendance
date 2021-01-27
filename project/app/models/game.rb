class Game < ApplicationRecord
	has_many :game_users
	has_many :users, through: :game_users
	belongs_to :war_time, optional: true
	has_one :room_message

	enum status: [
		:pending,
		:started,
		:finished,
		:unanswered
	]

	enum game_type: [
		:friendly,
		:chat,
		:ladder,
		:war_time,
		:tournament
	]

    validates :level,  presence: true
	validates :goal, presence: true

	def winner
		finished? && game_users.win.first.user
	end

	def looser
		finished? && game_users.loose.first.user
	end

	def finish
		ladder_swap if ladder? && winner.ladder_rank > looser.ladder_rank
	end

	def swap_ladder
		rank = winner.ladder_rank
		winner.update(ladder_position: looser.ladder_rank)
		looser.update(ladder_position: rank)
	end
		
end
