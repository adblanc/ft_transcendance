json.partial! "guilds/guild", guild: @guild
json.users do
  json.array! @guild.users do |user|
     json.id user.id
	 json.name user.name
	 json.avatar_url url_for(user.avatar) if user.avatar.attached?
	 json.guild_role user.guild_role?
	 json.admin user.admin?
	 json.contribution user.contribution
  end
end
json.pending_users do
  json.array! @guild.users do |user|
     json.id user.id
	 json.name user.name
	 json.avatar_url url_for(user.avatar) if user.avatar.attached?
	 json.guild_role user.guild_role?
	 json.admin user.admin?
	 json.contribution user.contribution
  end
end