json.extract! user, :id, :login, :is_present, :appearing_on
json.avatar_url url_for(user.avatar) if user.avatar.attached?
json.ladder_rank user.ladder_rank
