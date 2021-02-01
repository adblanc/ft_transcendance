class Tournament < ApplicationRecord
	has_many :tournament_users, dependent: :destroy
	has_many :users, through: :tournament_users
	has_many :games, dependent: :destroy

	enum status: [
		:pending,
		:started,
		:finished
	]

	validates :registration_start, presence: true
	validates :registration_end, presence: true
	/Validators for dates/

	/define max nb of users in controller for registration/

end
