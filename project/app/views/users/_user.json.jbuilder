json.extract! user, :guild, :pending_guild, :id, :login, :name, :contribution, :created_at, :updated_at
json.avatar_url url_for(user.avatar) if user.avatar.attached?
json.guild_role user.guild_role?
json.admin user.admin?
if user.guild_role?
  json.img_url url_for(user.guild.img) if user.guild.img.attached?
end