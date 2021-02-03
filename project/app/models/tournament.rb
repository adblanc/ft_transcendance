class Tournament < ApplicationRecord
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

	def owner
		User.all.each do | user |
			if user.has_role?(:owner, self)
				return user
			end
		end
		return nil
	end

end
