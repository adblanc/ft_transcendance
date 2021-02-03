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

	after_create :attach_trophy

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


end
