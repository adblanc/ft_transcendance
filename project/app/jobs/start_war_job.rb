class StartWarJob < ApplicationJob
	queue_as :default
  
	def perform(war)
	  /NOTIF/
	  war.update(status: :started)
	end
end