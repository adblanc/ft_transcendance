class EndWarJob < ApplicationJob
	queue_as :default
  
	def perform(war)
		/quid si égalité/
	  war.update(status: :ended)
	  if war.guilds.first.war_points(war) > war.guilds.second.war_points(war)
		war.guilds.first.win_score(war.prize)
		@winner = war.guilds.first
      elsif war.guilds.first.war_points(war) < war.guilds.second.war_points(war)
		war.guilds.second.win_score(war.prize)
		@winner = war.guilds.second
      end
	  war.guilds.each do |guild|
		guild.members.each do |member|
			member.send_notification("War with #{war.opponent(guild).name} just ended ! #{@winner.name} won #{war.prize}!", "/warindex")
		end
	  end
	end
end