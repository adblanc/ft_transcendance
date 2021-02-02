class PauseGameJob < ApplicationJob
	queue_as :default

	def my_logger
		@@my_logger ||= Logger.new("#{Rails.root}/log/my.log")
	  end

	def perform(game, player)
	  if game.started? || game.finished?
		return
	  end

	  my_logger.info("==== on perform pausegamejob, #{game.status}, player: #{player.user_id} ====");
		@winner = game.game_users.where.not(user_id: player.user_id).first
		@loser = player
		@winner.update(status: :won)
		@loser.update(status: :lose)
	  	game.update(status: :finished)
		game.handle_points

		my_logger.info("==== a perform #{game.status}, player: #{player.user_id} ====");

		game.broadcast_end(@winner, @loser);
	end
end
