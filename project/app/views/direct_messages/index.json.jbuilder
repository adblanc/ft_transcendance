json.array! @dms do |room|
	json.partial! "rooms/room", room: room
  end
