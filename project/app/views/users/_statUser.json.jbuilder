json.partial! "users/user", user: user
json.statUser do
  json.number_victory user.number_victory
  json.number_loss user.number_loss
  json.ladder_level user.ladder_level
  json.won_tournaments user.won_tournaments
  json.achievements user.achievements
end