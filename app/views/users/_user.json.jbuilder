json.extract! user, :id, :login, :name, :avatar_url, :created_at, :updated_at
json.url user_url(user, format: :json)
