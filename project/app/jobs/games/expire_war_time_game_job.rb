class ExpireWarTimeGameJob < ApplicationJob
	queue_as :default

	def perform(game, guild, opponent, warTime, user)
	  return if game.started? || game.finished?
	  game.update(status: :unanswered)
	  user.game_users.where(game: game).update(status: :won)
	  game.handle_points_wt
	  guild.members.each do |member|
		member.send_notification("#{opponent.name} has not answered #{user.name}'s' War Time challenge!", "/wars", "war")
	  end
	  opponent.members.each do |member|
		member.send_notification("Your guild has not answered #{user.name}'s' War Time challenge!", "/wars", "war")
	  end
	  ActionCable.server.broadcast("game_#{game.id}", {"event" => "expired"});
	  
	  warTime.increment!(:unanswered_calls, 1)
	  if warTime.unanswered_calls == warTime.max_unanswered_calls
		warTime.update(status: :inactive)
		guild.members.each do |member|
			member.send_notification("Too many unanswered match calls! War Time with #{opponent.name} just ended!", "/wars", "wars")
		end
		opponent.members.each do |member|
			member.send_notification("Too many unanswered match calls! War Time with #{guild.name} just ended!", "/wars", "wars")
		end
	  end
	end

	private
end