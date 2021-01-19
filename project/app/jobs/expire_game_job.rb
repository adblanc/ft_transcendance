class ExpireGameJob < ApplicationJob
	queue_as :default

	def perform(game)
	  return if game.started? || game.finished?
	  game.update(status: :unanswered)
	  ActionCable.server.broadcast("game_#{game.id}", {"event" => "expired"});
	end
end
