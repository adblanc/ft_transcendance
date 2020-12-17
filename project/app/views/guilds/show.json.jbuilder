json.partial! "guilds/guild", guild: @guild
json.members do
  json.array! @guild.members do |member|
     json.id member.id
	 json.name member.name
	 json.avatar_url url_for(member.avatar) if member.avatar.attached?
	 json.guild_role member.guild_role?
	 json.contribution member.contribution
  end
end
json.pending_members do
  json.array! @guild.pending_members do |pending_member|
     json.id pending_member.id
	 json.name pending_member.name
	 json.avatar_url url_for(pending_member.avatar) if pending_member.avatar.attached?
	 json.guild_role pending_member.guild_role?
	 json.contribution pending_member.contribution
  end
end
json.wars do
  json.array! @guild.wars do |war|
     json.id war.id
	 json.start war.start
	 json.end war.end
	 json.prize war.prize
	 json.status war.status
	 json.guilds war.guilds do |guild|
	 	json.id guild.id
	 	json.img_url url_for(guild.img) if guild.img.attached?
	 	json.name guild.name
		json.guild_wars guild.guild_wars do |guild_war|
			json.accept_status guild_war.status
			json.guild_points guild_war.points
		end
	  end
  end
end