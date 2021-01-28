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
		finished? && game_users.win.first.user
	end

	def loser
		finished? && game_users.lose.first.user
	end

	def finish
		self.update(status: :finished)
		if self.war_time?
			winner.guild.war_score(10)
		end
		if winner.guild?
			winner.guild.increment(:points, 10)
			winner.contribution.increment(:points, 10)
			/&& type de jeu pris en compte - inc tour etc.../
			if winner.guild.atWar? && !self.war_time?
				winner.guild.war_score(10)
			end
		end
		if self.ladder?
			self.ladder_swap if winner.ladder_rank > loser.ladder_rank
		end
	end

	def ladder_swap
		rank = winner.ladder_rank
		winner.update(ladder_rank: loser.ladder_rank)
		loser.update(ladder_rank: rank)
	end

	def	spectators
		User.with_role(:spectator, self);
	end

	def player_score(id)
		game_user = GameUser.where(user_id: id, game_id: self.id).first
		game_user.increment!(:points)
		if game_user.points == self.goal
			game_user.update(status: :win)
			self.game_users.where.not(user_id: self.id).first.update(status: :lose)
			self.finish
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

end
