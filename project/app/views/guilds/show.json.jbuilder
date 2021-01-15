json.partial! "guilds/guild", guild: @guild
json.members do
  json.array! @guild.members do |member|
	json.partial! "guilds/guildMember", member: member
  end
end
json.pending_members do
  json.array! @guild.pending_members do |pending_member|
    json.partial! "guilds/guildMember", member: pending_member
  end
end
json.wars do
		json.array! @guild.wars do |war|
		json.id war.id
		json.prize war.prize
		json.status war.status
		json.start war.start
		json.end war.end
		json.time_to_answer war.time_to_answer
		json.max_unanswered_calls war.max_unanswered_calls
		json.atWarTime war.atWarTime?
		json.warOpponent do
			json.id  @guild.warOpponent(war).id
			json.points  @guild.warOpponent(war).points
			json.name  @guild.warOpponent(war).name
			json.img_url url_for(@guild.warOpponent(war).img) if @guild.warOpponent(war).img.attached?
		end
	end
end
json.pendingWars do
		json.array! @guild.pendingWars do |pendingWar|
		json.id pendingWar.id
		json.prize pendingWar.prize
		json.status pendingWar.status
		json.start pendingWar.start
		json.end pendingWar.end
		json.time_to_answer pendingWar.time_to_answer
		json.max_unanswered_calls pendingWar.max_unanswered_calls
		json.inc_tour pendingWar.inc_tour
		json.warOpponent do
			json.id  @guild.warOpponent(pendingWar).id
			json.points  @guild.warOpponent(pendingWar).points
			json.name  @guild.warOpponent(pendingWar).name
			json.img_url url_for(@guild.warOpponent(pendingWar).img) if @guild.warOpponent(pendingWar).img.attached?
		end
	end
end
