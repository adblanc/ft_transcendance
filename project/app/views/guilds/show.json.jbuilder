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
  json.array! @guild.pending_users do |pending_user|
     json.id pending_user.id
	 json.name pending_user.name
	 json.avatar_url url_for(pending_user.avatar) if pending_user.avatar.attached?
	 json.guild_role pending_user.guild_role?
	 json.admin pending_user.admin?
	 json.contribution pending_user.contribution
  end
end