json.extract! guild, :id, :name, :ang, :points, :atWar, :created_at, :updated_at
json.img_url url_for(guild.img) if guild.img.attached?
json.users guild.users