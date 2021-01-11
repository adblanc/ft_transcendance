json.array! @games do |game|
  json.id game.id
  json.points game.points
  json.level game.level
  json.status game.status
  json.first game.first
  json.second game.second
end