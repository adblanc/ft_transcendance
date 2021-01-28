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

	def player_score(data)
		game_user = self.game_users.where(user_id: data["playerId"], game_id: self.id).first
		game_user.increment!(:points)

		ActionCable.server.broadcast("game_#{@id}", data);

		if (game_user.points >= self.goal)
			self.update(status: :finished)
			game_user.update(status: :won)
			looser = self.game_users.where.not(user_id: data["playerId"]).first

			looser.update(status: :lose)
			ActionCable.server.broadcast("game_#{self.id}", self.data_over(game_user, looser));
		end
	end

	private

	def data_over(winner, looser)
		res = {};
		res["action"] = "game_over";
		res["payload"] = {};
		res["payload"]["winner"] = {"id": winner.user_id, "points": winner.points, "status": :won };
		res["payload"]["looser"] = {"id": looser.user_id, "points": looser.points, "status": :lose };

		return res;
	end

end
