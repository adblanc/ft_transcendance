
class PlayGameJob < ApplicationJob
	queue_as :default
	def perform(game)
	  while game.started?
		/broadcast stuff here/
	  end
	  game.finish
	end
end