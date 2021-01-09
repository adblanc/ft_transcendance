json.partial! "users/user", user: user
json.roomRole user.room_role(room)
json.isRoomAdministrator user.is_room_administrator?(room)
json.isMute user.is_room_mute?(room)
json.isBan user.is_room_ban?(room)
json.isBlocked @current_user.is_blocked?(user)
