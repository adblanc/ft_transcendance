json.extract! game, :id, :level, :goal, :status, :game_type, :tournament_round
json.players do
	json.array! game.users do | user |
	   json.extract! user, :id, :name
	   json.points user.game_points(game)
	   if user.winner(game)
	   		json.winner user.winner(game)
		else
			json.winner nil
		end
	end
end
