json.extract! guild, :id, :name, :ang, :points, :created_at, :updated_at
json.img_url url_for(guild.img) if guild.img.attached?
json.atWar guild.atWar?
json.pendingWar guild.pendingWar?
json.warInitiator guild.warInitiator?
json.activeWar guild.activeWar
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