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

	def looser
		finished? && game_users.loose.first.user
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
			self.ladder_swap if && winner.ladder_rank > looser.ladder_rank
		end
	end

	def swap_ladder
		rank = winner.ladder_rank
		winner.update(ladder_position: looser.ladder_rank)
		looser.update(ladder_position: rank)
	end

	def	spectators
		User.with_role(:spectator, self);
	end

	def player_score(id)
		game_user = GameUser.where(user_id: id, game_id: self.id).first
		game_user.increment!(:points)
		if game_user.points == self.goal
			game_user.update(status: :win)
			self.game_users.where.not(user_id: id).first.update(status: :loose)
			self.finish
		end
	end

end
