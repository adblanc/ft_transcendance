json.partial! "guilds/guild", guild: @guild
json.members do
  json.array! @guild.members do |member|
     json.id member.id
	 json.name member.name
	 json.avatar_url url_for(member.avatar) if member.avatar.attached?
	 json.guild_role member.guild_role?
	 json.admin member.admin?
	 json.contribution member.contribution
  end
end