json.extract! user, :id, :login, :name, :created_at, :updated_at
json.avatar_url url_for(user.avatar) if user.avatar.attached?
