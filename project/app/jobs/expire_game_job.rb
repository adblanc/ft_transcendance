class ExpireGameJob < ApplicationJob
	queue_as :default

	def perform(game)
	  game.update(status: :unanswered)
	  ActionCable.server.broadcast("game_#{game.id}", {"event" => "expired"});
	end
end
