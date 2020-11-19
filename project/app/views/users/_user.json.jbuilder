json.extract! user, :guild, :id, :login, :name, :guild_role, :created_at, :updated_at
json.avatar_url url_for(user.avatar) if user.avatar.attached?
