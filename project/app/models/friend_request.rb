class FriendRequest < ApplicationRecord
  belongs_to :requestor, class_name: "User", foreign_key: :user_id
  belongs_to :receiver, class_name: "User", foreign_key: :user_id

  def other(user)
	if user == requestor
		return receiver
	else
		return requestor
	end
  end

end
