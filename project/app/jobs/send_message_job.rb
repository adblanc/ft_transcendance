class SendMessageJob < ApplicationJob
	queue_as :default

	def perform(user, room, content)
	  # Do something later
	  msg = RoomMessage.create(user: user, room: room, content: content)

	  ActionCable.server.broadcast("room_#{room.id}", msg);
	end
  end
