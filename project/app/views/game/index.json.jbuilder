json.array! @games do |game|
  json.id game.id
  json.name game.type
  json.points game.points
  json.level game.level
end