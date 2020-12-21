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
		json.prize war.prize
		json.status war.status
		json.start war.start
		json.end war.end
		json.warOpponent @guild.warOpponent(war)
		json.img url_for(@guild.warOpponent(war).img) if @guild.warOpponent(war).img.attached?
	end
end
json.pendingWars do
		json.array! @guild.pendingWars do |pendingWar|
		json.id pendingWar.id
		json.prize pendingWar.prize
		json.status pendingWar.status
		json.start pendingWar.start
		json.end pendingWar.end
		json.warOpponent @guild.warOpponent(pendingWar)
		json.img url_for(@guild.warOpponent(pendingWar).img) if @guild.warOpponent(pendingWar).img.attached?
	end
end
