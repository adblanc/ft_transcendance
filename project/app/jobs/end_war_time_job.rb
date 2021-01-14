class EndWarTimeJob < ApplicationJob
	queue_as :default

	def perform(warTime, war)
	  warTime.update(status: :inactive)
	  war.guilds.each do |guild|
		guild.members.each do |member|
			member.send_notification("WarTime with #{war.opponent(guild).name} just ended !", "/wars", "war")
		end
	  end
	end

end