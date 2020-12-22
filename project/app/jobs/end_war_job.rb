class EndWarJob < ApplicationJob
	queue_as :default
  
	def perform(war)
	  /POINTS STUFF/
	  war.update(status: :ended)
	  war.guilds.each do |guild|
		guild.members.each do |member|
			member.send_notification("War with #{war.opponent(guild).name} just ended !", "/warindex")
		end
	  end
	end
end