json.partial! "users/user", user: user
json.roomRole user.room_role(room)
json.isRoomAdministrator user.is_room_administrator?(room)
json.isMute user.is_room_mute?(room)
