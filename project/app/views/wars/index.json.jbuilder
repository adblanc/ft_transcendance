json.array! @wars do |war|
  json.id war.id
  json.start war.start
  json.end war.end
  json.prize war.prize
  json.status war.status
  json.guilds war.guilds
end