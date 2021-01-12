class StartWarJob < ApplicationJob
	queue_as :default

	def perform(war)
	  war.update(status: :started)
	  war.guilds.each do |guild|
		guild.members.each do |member|
			member.send_notification("War with #{war.opponent(guild).name} just started !", "/warindex", "war")
		end
	  end
	end
end
