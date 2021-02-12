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
	  	game.update(status: :forfeit)
		if game.war_time?
			game.handle_war_time_end
		else
			game.handle_points
		end
		game.broadcast_end(@winner, @loser);
	end
end
