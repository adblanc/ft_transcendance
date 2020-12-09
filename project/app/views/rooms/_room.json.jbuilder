json.extract! room, :name, :id, :created_at, :updated_at
json.isAdmin @current_user.has_role? :owner, room
