json.extract! guild, :id, :name, :ang, :points, :members, :atWar, :warLog, :created_at, :updated_at
json.img_url url_for(guild.img) if guild.img.attached?