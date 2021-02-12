class RoundJob < ApplicationJob
	queue_as :default

	def perform(tournament)
	  if tournament.final?
		tournament.update(status: :finished)
		ActionCable.server.broadcast("tournament_#{tournament.id}", {})
		handle_final(tournament)
		return
	  end

	  handle_games(tournament) 
	  change_round(tournament)

	  @round_length = 5
	  RoundJob.set(wait_until: DateTime.now + @round_length.minutes).perform_later(tournament)
	end

	private

	def change_round(tournament)
		if tournament.quarter?
			tournament.update(status: :semi)
			ActionCable.server.broadcast("tournament_#{tournament.id}", {})
		else
			tournament.update(status: :final)
			ActionCable.server.broadcast("tournament_#{tournament.id}", {})
		end
		tournament.games.where(tournament_round: tournament.status).each do | game |
			game.update(status: :pending)
		end
		tournament.tournament_users.competing.each do | t_user |
		  t_user.user.send_notification("#{tournament.name} : #{tournament.status} games are up!", "tournaments/#{tournament.id}", "tournaments")
		end
	end

	def handle_games(tournament)
		tournament.games.where(tournament_round: tournament.status).each do | game |
			if (game.pending? || game.matched?) && game.game_users.where(status: :ready).first.present?
				@winner = game.game_users.where(status: :ready).first.user
				handle_forfeit(@winner, game, tournament, true)
			elsif game.pending? || game.matched?
				@random = game.users.sample
				handle_forfeit(@random, game, tournament, false)
			end
		end
	end

	def handle_forfeit(winner, game, tournament, forfeit)
		finish_game(winner, game)
		tournament.push_next_round(game.winner)
		tournament.set_tournament_user(nil, game.loser)
		forfeit_notif(tournament, game.winner, game.loser, forfeit)
	end

	def finish_game(winner, game)
		game.game_users.where(user_id: winner.id).first.update(status: :won)
		game.game_users.where.not(user_id: winner.id).first.update(status: :lose)
		game.update(status: :forfeit)
		game.handle_points
	end

	def forfeit_notif(tournament, winner, loser, forfeit)
		if forfeit == true
			winner.send_notification("You won your game by forfeit for #{tournament.name}", "tournaments/#{tournament.id}", "tournaments")
			loser.send_notification("You lost your game by forfeit for #{tournament.name}", "tournaments/#{tournament.id}", "tournaments")
		else
			winner.send_notification("You randomly won your game for #{tournament.name}", "tournaments/#{tournament.id}", "tournaments")
			loser.send_notification("You randomly lost your game for #{tournament.name}", "tournaments/#{tournament.id}", "tournaments")
		end
	end

	def handle_final(tournament)
		@game = tournament.games.final.first
		if @game.finished? || game.forfeit?
			finish_notif(tournament, @game.winner)
		elsif (@game.pending? || @game.matched?) && @game.game_users.where(status: :ready).first.present?
			@winner = @game.game_users.where(status: :ready).first.user
			finish_game(@winner, @game)
			tournament.set_tournament_user(@game.winner, @game.loser)
			forfeit_notif(tournament, @game.winner, @game.loser, forfeit)
			finish_notif(tournament, @game.winner)
		elsif @game.pending? || @game.matched?
			@game.update(status: :abandon)
			@game.users.each do | user |
				user.game_users.where(game: @game).first.update(status: :lose)
				user.tournament_users.where(tournament: tournament).first.update(status: :eliminated)
				user.send_notification("You haven't played your tournament final. You have lost the tournament!", "tournaments/#{tournament.id}", "tournaments")
			end
			finish_notif(tournament, nil)
		end
	end

	def finish_notif(tournament, winner)
		if winner
			User.all.each do |user|
				user.send_notification("#{tournament.name} tournament is over. Winner is : #{winner.name}", "tournaments/#{tournament.id}", "tournaments")
			end
		else
			User.all.each do |user|
				user.send_notification("#{tournament.name} tournament final was not played! Tournament is over and has no winner!", "tournaments/#{tournament.id}", "tournaments")
			end
		end
	end

end
