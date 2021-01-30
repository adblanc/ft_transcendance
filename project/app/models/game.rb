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

	def winner
		if self.finished? || self.unanswered?
			self.game_users.won.first.user
		end
	end

	def loser
		if self.finished? || self.unanswered?
			self.game_users.lose.first.user
		end
	end

	def handle_friendly_game
		@war = self.winner.guild.startedWar
		@level = []
		@goal = []
		@level << (@war.inc_easy ? "easy" : "")
		@level << (@war.inc_normal ? "normal" : "")
		@level << (@war.inc_hard ? "hard" : "")
		@goal << (@war.inc_three ? 3 : 0)
		@goal << (@war.inc_six ? 6 : 0)
		@goal << (@war.inc_nine ? 9 : 0)

		@score = false
		@level.each do | level |
			if level == self.level
				@score = true
			end
		end
		@goal.each do | goal |
			if goal == self.goal && @score
				self.winner.guild.war_score(10)
			end
		end
	end

	def handle_war_points
		@war = self.winner.guild.startedWar
		if self.ladder? && @war.inc_ladder
			self.winner.guild.war_score(10)
		elsif self.tournament? && @war.inc_ladder
			self.winner.guild.war_score(10)
		elsif self.friendly? && @war.inc_friendly
			self.handle_friendly_game
		end
	end

	def handle_points
		if self.war_time?
			self.winner.guild.war_score(10)
		end
		if self.winner.guild?
			self.winner.guild.increment!(:points, 10)
			self.winner.increment!(:contribution, 10)
			if self.loser.guild?
				if self.winner.guild.startedWar && self.loser.guild.startedWar && !self.war_time?
					if self.winner.guild.startedWar == self.loser.guild.startedWar
						self.handle_war_points
					end
				end
			end
		end
		if self.ladder?
			self.ladder_swap if self.winner.ladder_rank > self.loser.ladder_rank
		end
	end

	def ladder_swap
		rank = self.winner.ladder_rank
		self.winner.update(ladder_rank: self.loser.ladder_rank)
		self.loser.update(ladder_rank: rank)
	end

	def	spectators
		User.with_role(:spectator, self);
	end

	def player_score(data)
		game_user = self.game_users.where(user_id: data["playerId"], game_id: self.id).first
		game_user.increment!(:points)

		self.broadcast(data);

		if (game_user.points >= self.goal)
			game_user.update(status: :won)
			looser = self.game_users.where.not(user_id: data["playerId"]).first
			looser.update(status: :lose)
			self.update(status: :finished)
			self.handle_points
			self.broadcast(self.data_over(game_user, looser))
		end
	end

	def initiator
		if self.pending?
			self.game_users.accepted.first.user
		end
	end

	def opponent(user)
		if self.users.count == 2
			self.users.where.not(id: user.id).first
		end
	end

	def add_host(player)
		self.users.push(player)
		player.add_role(:host, self);
	end

	def add_second_player(player)
		self.add_player_role(player)
		self.users.push(player)
		self.update(status: :started)
		self.broadcast({"event" => "started"});
	end

	def add_player_role(player)
		player.remove_role(:spectator, self);
		player.add_role(:player, self);
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

	def broadcast(data)
		ActionCable.server.broadcast("game_#{self.id}", data);
	end

end
