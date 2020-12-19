json.extract! guild, :id, :name, :ang, :points, :created_at, :updated_at
json.img_url url_for(guild.img) if guild.img.attached?
json.atWar guild.atWar?
json.warInitiator guild.warInitiator?

