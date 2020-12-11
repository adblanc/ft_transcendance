json.partial! "users/user", user: @current_user
json.notifications do
  json.array! @current_user.notifications do |notification|
     json.id notification.id
	 json.actor notification.actor
	 json.action notification.action
	 json.notifiable notification.notifiable
	 json.notifiable_type notification.notifiable_type
	 json.notifiable_id notification.notifiable_id
	 json.created_at notification.created_at
  end
end