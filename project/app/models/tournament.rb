class Tournament < ApplicationRecord
  resourcify
	has_many :tournament_users, dependent: :destroy
	has_many :users, through: :tournament_users
	has_many :games, dependent: :destroy
	has_one_attached :trophy

	enum status: [
		:pending,
		:registration,
		:round_one,
		:round_two,
		:round_three,
		:finished
	]

	validates :name, presence: true
	validates :registration_start, presence: true
	validates :registration_end, presence: true
	validates_with RegistrationDateValidator
	validates :trophy, blob: { content_type: :image, size_range: 1..5.megabytes }

	after_create do
		attach_trophy
		create_tournament_games
		StartRegistrationJob.set(wait_until: registration_start)
			.perform_later(self)
	end

	def create_tournament_games
	    create_games(:quarter, 4)
	    create_games(:semi, 2)
	    create_games(:final, 1)
	end
	
	def create_games(round, number)
	    number.times do
	        games.push(Game.create(
	            level: :hard,
	            goal: 9,
	            game_type: :tournament,
	            status: :waiting_tournament,
	            tournament_round: round
	        ))
	    end
	end

	def attach_trophy
		self.trophy.attach(
			io: File.open("default/trophy.jpg", "r"),
			filename: "trophy.jpg",
			"content_type": "image/jpeg",
		) if !self.trophy.attached?
	end

	def owner
		User.all.each do | user |
			if user.has_role?(:owner, self)
				return user
			end
		end
		return nil
	end

	def open_registration?
		registration_start <= DateTime.now && DateTime.now <= registration_end
	end

	def round_one_games
		games.quarter
	end

	def round_two_games
		games.semi
	end

	def round_three_games
		games.final
	end

	def full?
		users.count == 8
	end

	def user_status(user)
		if self.tournament_users.where(user_id: user.id).first
			return self.tournament_users.where(user_id: user.id).first.status
		else
			return nil
		end
	end
end
