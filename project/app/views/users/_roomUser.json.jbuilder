json.partial! "users/user", user: user
json.isRoomAdministrator user.is_room_administrator?(room)
json.roomRole user.room_role(room)
