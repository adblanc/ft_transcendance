json.extract! tournament, :id, :name, :status, :registration_start, :registration_end, :created_at, :updated_at
json.trophy_url url_for(tournament.trophy) if tournament.trophy.attached?
if tournament.games
	json.games do
		json.array! tournament.games do |game|
			json.partial! "games/game", game: game
		end
	end
else
	json.games nil
end
if tournament.owner
	json.owner do
		json.id tournament.owner.id
		json.name tournament.owner.name
	end
else
	json.owner nil
end