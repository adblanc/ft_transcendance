json.extract! user, :guild, :id, :login, :name, :contribution, :created_at, :updated_at
json.avatar_url url_for(user.avatar) if user.avatar.attached?
json.guild_role user.guild_role?
json.admin user.admin?
json.img_url url_for(user.guild.img) if user.guild.img.attached?