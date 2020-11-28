class RoomMessage < ApplicationRecord
  belongs_to :user
  belongs_to :room, inverse_of: :room_messages

  # def as_json(options)
  #   super(options).merge(avatar_url: url_for(user.avatar))
  # end
end
