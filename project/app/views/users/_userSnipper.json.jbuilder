json.extract! user, :id, :login
json.avatar_url url_for(user.avatar) if user.avatar.attached?
