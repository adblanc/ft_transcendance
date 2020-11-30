json.array! @notifications do |notification|
  json.id notification.id
  #json.recipient notification.recipient
  json.actor notification.actor.username
  json.action notification.action
  json.notifiable do
	json.type "{notification.notifiable.name}"
  end
  json.url guild_path(notification.notifiable)
end