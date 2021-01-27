class Game < ApplicationRecord
	resourcify

	has_many :game_users
	has_many :users, through: :game_users
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

	def	spectators
		User.with_role(:spectator, self);
	end

	def player_score(id)
		game_user = GameUser.where(user_id: id, game_id: self.id).first
		game_user.increment!(:points)
		if game_user.points == self.goal
			self.update(status: :finished)
		end
	end

end
