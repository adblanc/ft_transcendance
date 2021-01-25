json.extract! room, :id, :is_private, :is_dm, :created_at, :updated_at
json.name room.correct_name(@current_user)
json.isOwner @current_user.is_room_owner?(room)
json.users do
	json.array! room.users do |user|
		json.partial! "users/roomUser", user: user, room: room
	end
	if (@current_user.admin?)
		json.array! [@current_user] do |user|
			json.partial! "users/roomUser", user: user, room: room
		end
	end
end
json.messages do
	json.array! room.room_messages do |message|
		json.partial! "rooms/room_message", room_message: message
	end
end