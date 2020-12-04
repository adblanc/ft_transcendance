class NotificationsController < ApplicationController

	def mark_as_read
		@notification = Notification.find(params[:id])
		if @notification.save(read_at: Time.zone.now)
			@notification
		end
	end
end