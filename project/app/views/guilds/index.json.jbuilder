json.array! @guilds do |guild|
  json.id guild.id
  json.name guild.name
  json.points guild.points
  json.members guild.members
  json.atWar guild.atWar
  json.warLog guild.warLog
  json.img_url url_for(guild.img) if guild.img.attached?
end