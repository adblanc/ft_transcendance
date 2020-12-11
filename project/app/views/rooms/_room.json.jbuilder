json.extract! room, :name, :id, :created_at, :updated_at
json.isOwner @current_user.has_role? :owner, room
json.users do
	json.array! room.users do |user|
		json.partial! "users/roomUser", user: user, room: room
	end
end
