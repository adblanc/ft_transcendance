json.extract! tournament, :id, :name, :status, :registration_start, :registration_end, :created_at, :updated_at
json.trophy_url url_for(tournament.trophy) if tournament.trophy.attached?
json.open_registration tournament.open_registration?
json.round_one_games do
	json.array! tournament.round_one_games do |game|
		json.partial! "games/game_tournament", game: game
	end
end
json.round_two_games do
	json.array! tournament.round_two_games do |game|
		json.partial! "games/game_tournament", game: game
	end
end
json.round_three_games do
	json.array! tournament.round_three_games do |game|
		json.partial! "games/game_tournament", game: game
	end
end

if tournament.owner
	json.owner do
		json.id tournament.owner.id
		json.name tournament.owner.name
	end
else
	json.owner nil
end