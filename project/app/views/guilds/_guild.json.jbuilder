json.extract! guild, :id, :name, :ang, :points, :created_at, :updated_at
json.img_url url_for(guild.img) if guild.img.attached?
json.atWar guild.atWar?
json.pendingWar guild.pendingWar?
json.warInitiator guild.warInitiator?
json.activeWar guild.activeWar
json.waitingWar guild.waitingWar
json.warOpponent guild.warOpponent(guild.activeWar) if guild.activeWar
json.warOpponentImg url_for(guild.warOpponent(guild.activeWar).img) if guild.activeWar
json.warOpponent guild.warOpponent(guild.waitingWar) if guild.waitingWar
json.warOpponentImg url_for(guild.warOpponent(guild.waitingWar).img) if guild.waitingWar
