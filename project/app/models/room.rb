class Room < ApplicationRecord
	resourcify

	has_secure_password :password, validations: false

	validates :name, presence: true, uniqueness: true
	validates :password, allow_blank: true, length: {minimum: 0}

	has_many :room_messages, dependent: :destroy,
						 inverse_of: :room
	has_and_belongs_to_many :users


	def update_user_role(user, action)
		case action
		when "promote"
			if (user.is_member?(self))
				user.add_role :administrator, self
			end
		when "demote"
			if (user.is_room_administrator?(self))
				user.remove_role :administrator, self
			end
		end
	end

end
