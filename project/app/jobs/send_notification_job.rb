class SendNotificationJob < ApplicationJob
	queue_as :default
  
	def perform(user, actor, action, notifiable)
	  NotificationsChannel.broadcast_to(
		user,
		actor: actor,
		action: action,
		notifiable: notifiable,
	  )
	end
  end