json.partial! "users/user", user: @other_user
json.partial! "users/gameHistory", user: @other_user
json.partial! "users/statUser", user: @other_user
json.is_friend @other_user.is_friend_of?(@current_user)
json.has_requested_friend @other_user.has_requested_friend?(@current_user)
json.has_received_friend @other_user.has_received_friend?(@current_user)
json.tournaments do
	json.array! @other_user.tournaments do |tour|
		json.partial! "tournaments/tournament", tournament: tour
		json.tournament_status @other_user.tournament_status(tour)
	end
end
