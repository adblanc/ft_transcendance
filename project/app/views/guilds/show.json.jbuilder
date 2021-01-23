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
		json.nb_games war.nb_games
		json.nb_wartimes war.nb_wartimes
		json.war_points war.war_points(@guild)
		json.winner war.winner 
		json.warOpponent do
			json.id  @guild.warOpponent(war).id
			json.ang  @guild.warOpponent(war).ang
			json.war_points  @guild.warOpponent(war).war_points(war)
			json.name  @guild.warOpponent(war).name
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
			json.name  @guild.warOpponent(pendingWar).name
			json.img_url url_for(@guild.warOpponent(pendingWar).img) if @guild.warOpponent(pendingWar).img.attached?
			json.points  @guild.warOpponent(pendingWar).points
		end
	end
end
