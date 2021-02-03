json.partial! "users/user", user: user
json.games do
  json.array! user.games do |game|
     json.game_id game.id
	 json.game_type game.game_type
     json.game_level game.level
	  json.won user.game_won?(game)
     json.opponent game.opponent(user).login
     json.goal game.goal
     json.winner game.winner
	 json.created_at game.created_at
  end
end