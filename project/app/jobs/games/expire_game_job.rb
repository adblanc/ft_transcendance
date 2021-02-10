class ExpireGameJob < ApplicationJob
	queue_as :default

	def perform(game, room)
	  return if !game || game.started? || game.finished?
	  if game.ladder?
		@winner = game.initiator
		@loser = game.opponent(@winner)
		@winner.game_users.where(game: game).update(status: :won)
		@loser.game_users.where(game: game).update(status: :lose)
		game.update(status: :unanswered)
	  	game.handle_points
		@winner.send_notification("Your Ladder challenge was not answered! You moved up the Ladder", "/tournaments/ladder", "game")
		@loser.send_notification("You failed to answer a Ladder Challenge! You moved down the Ladder", "/tournaments/ladder", "game")
		game.broadcast({"action" => "expired"});
		if room
			ActionCable.server.broadcast("room_#{room.id}", {"action" => "playchat"});
		end
	  else
		game.broadcast({"action" => "expired"});
		if room
			ActionCable.server.broadcast("room_#{room.id}", {"action" => "playchat"});
		end
		game.destroy
	  end
	end

end
