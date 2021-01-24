class ExpireGameJob < ApplicationJob
	queue_as :default

	def perform(game, current_user, room)
	  return if game.started? || game.finished?
	  game.update(status: :unanswered)
	  ActionCable.server.broadcast("game_#{game.id}", {"event" => "expired"});
	  if room
		  ActionCable.server.broadcast("room_#{room.id}", {"event" => "playchat"});
	  end
	  broadcast_game(current_user)
	end

	private

	def broadcast_game(current_user)
		if current_user.rooms.present?
			current_user.rooms.each do |room|
				ActionCable.server.broadcast("room_#{room.id}", {"event" => "playchat"});
			end
		end
	end
end
