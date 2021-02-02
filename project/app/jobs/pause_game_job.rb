class PauseGameJob < ApplicationJob
	queue_as :default

	def perform(game, player)
	  if game.started? || game.finished?
		return
	  end
		@winner = game.game_users.where.not(user_id: player.user_id).first
		@loser = player
		@winner.update(status: :won)
		@loser.update(status: :lose)
		game.update(status: :finished)
		game.handle_points

		game.broadcast_end(@winner, @loser);
	end
end
