class ExpireWarJob < ApplicationJob
	queue_as :default

	def perform(war)
	  if not war.started?
		war.initiator.members.each do | member |
			member.send_notification("#{war.opponent(war.initiator).name} never answered you war declaration!", "/wars", "war")
		end
		war.destroy
	  end
	end
end
