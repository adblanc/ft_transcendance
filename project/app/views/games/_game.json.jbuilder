json.extract! game, :id, :level, :goal, :status, :game_type, :war_time
json.isSpectator @current_user.is_spectating?(game)
json.isHost @current_user.is_host?(game)

json.spectators do
	json.array! game.spectators do |spectator|
		json.partial! "games/spectator", spectator: spectator
	end
end
json.players do
	json.array! game.users.sort_by {|u| u.id === @current_user.id ? -1 : 1} do |user|
	   json.extract! user, :id, :name
	   json.avatar_url url_for(user.avatar) if user.avatar.attached?
	   json.points user.game_points(game)
	   json.status user.game_status(game)
	end
end

opponent = game.game_user_opponent(@current_user)
if (opponent)
	json.extract! opponent, :pause_duration, :last_pause
end
