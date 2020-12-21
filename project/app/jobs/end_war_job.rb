class EndWarJob < ApplicationJob
	queue_as :default
  
	def perform(war)
	  /NOTIF and POINTS STUFF/
	  war.update(status: :ended)
	end
end