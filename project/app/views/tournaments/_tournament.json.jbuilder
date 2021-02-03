json.extract! tournament, :id, :name, :status, :registration_start, :registration_end, :created_at, :updated_at
json.trophy_url url_for(tournament.img) if tournament.trophy.attached?
if tournament.games
	json.games do
		json.array! tournament.games do |game|
			json.partial! "games/game", game: game
		end
	end
else
	json.games nil
end