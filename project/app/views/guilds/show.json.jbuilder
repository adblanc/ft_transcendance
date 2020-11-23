json.partial! "guilds/guild", guild: @guild
json.users do
  json.array! @guild.users do |user|
     json.id user.id
	 json.name user.name
	 json.guild_role user.guild_role
	 json.avatar_url url_for(user.avatar) if user.avatar.attached?
  end
end