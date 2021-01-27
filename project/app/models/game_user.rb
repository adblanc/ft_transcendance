class GameUser < ApplicationRecord
    belongs_to :game
    belongs_to :user

	enum status: [
		:pending,
		:win,
		:loose
	]

end
