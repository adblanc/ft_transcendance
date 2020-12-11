json.array! @games do |game|
  json.id game.id
  json.name game.Type
  json.points guild.Points
end