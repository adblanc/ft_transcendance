json.partial! "wars/war", war: @war
json.guilds do
  json.array! @war.guilds do |guild|
     json.id guild.id
	 json.name guild.name
  end
end