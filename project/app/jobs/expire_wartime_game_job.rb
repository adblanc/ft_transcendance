class ExpireWarTimeGameJob < ApplicationJob
	queue_as :default

	def perform(game, guild, opponent, warTime, user)
	  game.update(status: :unanswered)
	  guild.members.each do |member|
		member.send_notification("#{opponent.name} has not answered #{user.name}'s' war time challenge!", "/wars", "war")
	  end
	  opponent.members.each do |member|
		member.send_notification("Your guild has not answered #{user.name}'s' war time challenge!", "/wars", "war")
	  end

	  warTime.unanswered_calls.increment
	  if warTime.unanswered_calls == warTime.max_unanswered_calls
		warTime.update(status: :inactive)
		guild.members.each do |member|
			member.send_notification("Too many unanswered match calls! War Time is over with #{opponent.name} just ended!", "/wars", "war")
		  end
		  opponent.members.each do |member|
			member.send_notification("Too many unanswered match calls! War Time is over with #{guild.name} just ended!", "/wars", "war")
		  end
	  end
	end
end
