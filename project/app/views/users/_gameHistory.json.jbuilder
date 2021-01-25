json.partial! "users/user", user: user
json.games do
  json.array! @current_user.games do |game|
     json.game_id game.id
	 json.game_type game.game_type
     json.game_level game.level
	 #json.game_won game.game_won?
     #json.game_enemy game.game_enemy?
     #json.game_points game.points?
	 json.created_at game.created_at
  end
end