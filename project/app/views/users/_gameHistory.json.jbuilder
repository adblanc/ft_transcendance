json.partial! "users/user", user: user
if user.games
	json.games do
		json.array! user.games_finished do |game|
			json.id game.id
			json.status game.status
			json.created_at game.created_at
			json.game_type game.game_type
			json.level game.level
			json.won user.game_won?(game)
			if game.opponent(user)
				json.opponentname game.opponent(user).login
				json.opponentid game.opponent(user).id
			end
			json.goal game.goal
			json.created_at game.created_at
		end
	end
else
	json.games nil
end
