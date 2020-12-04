class NotificationsChannel < ApplicationCable::Channel
	def subscribed
		user = params[:user];
    	stream_for user
  
	  notifications = Notification.where(recipient_id: user).order(created_at: :asc).each do |notification|
		transmit(notification)
	  end
	end
  
	def unsubscribed
	  # Any cleanup needed when channel is unsubscribed
	end
  end
  