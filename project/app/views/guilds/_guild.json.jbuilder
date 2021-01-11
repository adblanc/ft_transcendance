json.extract! guild, :id, :name, :ang, :points, :created_at, :updated_at
json.img_url url_for(guild.img) if guild.img.attached?
json.atWar guild.atWar?
json.pendingWar guild.pendingWar?
json.warInitiator guild.warInitiator?
if guild.activeWar
	json.activeWar do
		json.id guild.activeWar.id
		json.prize guild.activeWar.prize
		json.start guild.activeWar.start
		json.end guild.activeWar.end
		json.status guild.activeWar.status
		json.time_to_answer guild.activeWar.time_to_answer
		json.max_unanswered_calls guild.activeWar.max_unanswered_calls
		json.atWarTime guild.activeWar.atWarTime?
		if guild.activeWar.activeWarTime
			json.activeWarTime do
				json.id guild.activeWar.activeWarTime.id
				json.end guild.activeWar.activeWarTime.end
				json.time_to_answer guild.activeWar.activeWarTime.time_to_answer
				json.max_unanswered_calls guild.activeWar.activeWarTime.max_unanswered_calls
				json.unanswered_calls guild.activeWar.activeWarTime.unanswered_calls
			end
		end
	end
end
json.waitingWar guild.waitingWar
if guild.activeWar
	json.warOpponent do 
		json.id  guild.warOpponent(guild.activeWar).id
		json.name  guild.warOpponent(guild.activeWar).name
		json.img_url url_for(guild.warOpponent(guild.activeWar).img) if guild.warOpponent(guild.activeWar).img.attached?
	end
end 
if guild.waitingWar
	json.warOpponent do 
		json.id  guild.warOpponent(guild.waitingWar).id
		json.name  guild.warOpponent(guild.waitingWar).name
		json.img_url url_for(guild.warOpponent(guild.waitingWar).img) if guild.warOpponent(guild.waitingWar).img.attached?
	end
end 