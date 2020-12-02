class NotificationsChannel < ApplicationCable::Channel
	def subscribed
	  room_id = params[:user_id];
	  stream_from "user_#{user_id}"
  
	  notifications = Notification.where(user_id: user_id).order(created_at: :asc).each do |notification|
		transmit(notification)
	  end
	end
  
	def unsubscribed
	  # Any cleanup needed when channel is unsubscribed
	end
  end
  