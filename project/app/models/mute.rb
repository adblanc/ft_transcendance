class Mute < ApplicationRecord
	belongs_to :user
	belongs_to :muted_user, :class_name => "User"

end
