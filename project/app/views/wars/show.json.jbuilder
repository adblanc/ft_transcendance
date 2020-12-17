json.partial! "wars/war", war: @war
json.guilds do
  json.array! @war.guilds do |guild|
     json.id guild.id
	 json.name guild.name
	 json.img_url url_for(guild.img) if guild.img.attached?
	 json.guild_wars guild.guild_wars do |guild_war|
			json.accept_status guild_war.status
			json.guild_points guild_war.points
	  end
  end
end