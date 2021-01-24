json.array! @admin_rooms do |room|
	json.partial! "rooms/room", room: room
end
