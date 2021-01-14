json.partial! "guilds/guild", guild: @guild
json.members do
  json.array! @guild.members do |member|
	json.partial! "guilds/guildMember", member: member
  end
end
