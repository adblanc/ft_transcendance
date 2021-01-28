class Game < ApplicationRecord
	resourcify

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

	def finish
		logger.debug "test"
	end

	def	spectators
		User.with_role(:spectator, self);
	end

	def player_score(id)
		game_user = self.game_users.where(user_id: id, game_id: self.id).first
		game_user.increment!(:points)

		logger.debug("==== game_user points #{game_user.points} ====")
		if (game_user.points >= self.goal)
			self.update(status: :finished)
			ActionCable.server.broadcast("game_#{self.id}", self.data_over);
		end
	end

	private

	def data_over
		res = {};
		res["action"] = "game_over";

		return res;
	end

end
