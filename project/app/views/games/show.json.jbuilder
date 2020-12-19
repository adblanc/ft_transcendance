json.partial! "games/game", game: @game
json.user do
  json.array! @game.user do |user|
     json.id user.id
	 json.name user.name
  end
end