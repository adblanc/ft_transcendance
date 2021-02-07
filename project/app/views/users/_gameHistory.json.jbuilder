json.partial! "users/user", user: user
if user.games
	json.games do
		json.array! user.games do |game|
			json.game_id game.id
			json.status game.status
			json.game_type game.game_type
			json.game_level game.level
			json.won user.game_won?(game)
			json.opponentname game.opponent(user).login
			json.opponentid game.opponent(user).id
			json.goal game.goal
			json.winner game.winner
			json.created_at game.created_at
		end
	end
else
	json.games nil
end