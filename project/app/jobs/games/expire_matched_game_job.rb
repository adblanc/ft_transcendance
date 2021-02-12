class ExpireMatchedGameJob < ApplicationJob
	queue_as :default

	def perform(game)
	  return unless game.matched?

		winner = game.game_users.where(status: :ready).first
		if winner
			winner.update(status: :won)
			looser = game.game_users.where.not(id: winner.id).first
			if (looser)
				looser.update(status: :lose)
			end
			game.update(status: :forfeit)
			game.handle_end_cases
			game.broadcast_end(winner, looser)
		else
			game.update(status: :forfeit)
			game.broadcast_end(nil, nil)
			game.destroy
		end
	end
end
