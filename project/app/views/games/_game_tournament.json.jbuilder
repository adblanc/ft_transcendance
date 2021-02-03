json.extract! game, :id, :level, :goal, :status, :game_type, :tournament_round
json.users do
	json.array! game.users do | user |
	   json.extract! user, :id, :name
	   json.points user.game_points(game)
	end
end
