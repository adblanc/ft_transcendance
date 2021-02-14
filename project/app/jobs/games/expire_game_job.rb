class ExpireGameJob < ApplicationJob
	queue_as :default

	discard_on ActiveJob::DeserializationError do |job, error|
		Rails.logger.error("Skipping job because of ActiveJob::DeserializationError (#{error.message})")
	end

	def perform(game, room)
	  return if game.started? || game.finished? || game.matched? || game.forfeit? || game.paused?
	  if game.ladder?
		@winner = game.initiator
		@loser = game.opponent(@winner)
		@winner.game_users.where(game: game).update(status: :won)
		@loser.game_users.where(game: game).update(status: :lose)
		game.update(status: :forfeit)
	  	game.handle_points
		@winner.send_notification("Your Ladder challenge was not answered! You moved up the Ladder", "/tournaments/ladder", "game")
		@loser.send_notification("You failed to answer a Ladder Challenge! You moved down the Ladder", "/tournaments/ladder", "game")
		game.broadcast({"action" => "expired"});
	  else
		game.broadcast({"action" => "expired"});
		if room
			game.update(status: :forfeit)
			ActionCable.server.broadcast("room_#{room.id}", {"event" => "playchat:expired", "game_id": game.id});
		end
		game.destroy
	  end
	end

end
