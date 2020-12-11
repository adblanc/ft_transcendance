json.extract! room, :name, :id, :created_at, :updated_at
json.isOwner @current_user.has_role? :owner, room
json.users do
	json.array! room.users do |user|
		json.partial! "users/user", user: user
		json.isRoomAdministrator user.is_room_administrator?(room)
		json.roomRole user.room_role(room)
	end
end
