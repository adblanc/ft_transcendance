json.extract! game, :id, :level, :goal, :status, :game_type, :war_time
json.isSpectator @current_user.is_spectating?(game)
json.spectators do
	json.array! game.spectators do |spectator|
		json.partial! "games/spectator", spectator: spectator
	end
end
json.users do
	json.array! game.users do |user|
	   json.id user.id
	   json.name user.name
	end
end
