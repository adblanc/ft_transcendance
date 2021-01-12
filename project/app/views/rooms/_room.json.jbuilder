json.extract! room, :id, :is_private, :is_dm, :created_at, :updated_at
json.name room.correct_name(@current_user)
json.isOwner @current_user.has_role? :owner, room
json.users do
	json.array! room.users do |user|
		json.partial! "users/roomUser", user: user, room: room
	end
end
