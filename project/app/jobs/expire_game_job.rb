class ExpireGameJob < ApplicationJob
	queue_as :default

	def perform(game, room)
	  return if game.started? || game.finished?
	  game.update(status: :unanswered)
	  ActionCable.server.broadcast("game_#{game.id}", {"event" => "expired"});
	  if room
		  ActionCable.server.broadcast("room_#{room.id}", {"event" => "playchat"});
	  end
	end
end
