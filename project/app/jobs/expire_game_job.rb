class ExpireGameJob < ApplicationJob
	queue_as :default

	def perform(game, room)
	  return if game.started? || game.finished?
	  if game.ladder?
		@winner = game.initiator
		@loser = game.opponent(@winner)
		rank = @winner.ladder_rank
		@winner.update(ladder_rank: @loser.ladder_rank)
		@loser.update(ladder_rank: rank)
		@winner.send_notification("Your Ladder challenge was not answered! You moved up the Ladder", "/tournaments/ladder", "game")
		@loser.send_notification("You failed to answer a Ladder Challenge! You moved down the Ladder", "/tournaments/ladder", "game")
	  end 
	  game.update(status: :unanswered)
	  ActionCable.server.broadcast("game_#{game.id}", {"event" => "expired"});
	  if room
		  ActionCable.server.broadcast("room_#{room.id}", {"event" => "playchat"});
	  end
	end

end
