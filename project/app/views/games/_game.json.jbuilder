json.extract! game, :id, :level, :goal, :status, :game_type, :war_time
json.isSpectator @current_user.is_spectating?(game)
json.isHost @current_user.is_host?(game)
json.spectators do
	json.array! game.spectators do |spectator|
		json.partial! "games/spectator", spectator: spectator
	end
end
json.players do
	json.array! game.users do |user|
	   json.extract! user, :id, :name
	   json.points user.game_points(game)
	end
end
