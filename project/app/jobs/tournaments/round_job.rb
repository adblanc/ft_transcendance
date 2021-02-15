class RoundJob < ApplicationJob
	queue_as :default

	def perform(tournament)
		return if tournament.finished?
	  handle_games(tournament) 

	  my_logger.info("winner : #{tournament.status}")

	  if tournament.quarter? || tournament.semi? 
		change_round(tournament)
	  	RoundJob.set(wait_until: DateTime.now + 1.minutes).perform_later(tournament)
	  end
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
			if game.pending? && game.game_users.where(status: :accepted).first.present?
				@winner = game.game_users.where(status: :accepted).first.user
				tournament.finish_game(@winner, game)
				tournament.forfeit_notif(game.winner, game.loser, true)
			elsif game.pending? && game.final?
				game.update(status: :abandon)
				game.users.each do | user |
					user.game_users.where(game: game).first.update(status: :lose)
					user.tournament_users.where(tournament: tournament).first.update(status: :eliminated)
					user.send_notification("You haven't played your tournament final. You have lost the tournament!", "tournaments/#{tournament.id}", "tournaments")
				end
				tournament.finish_tournament(nil)
			elsif game.pending?
				@random = game.users.sample
				tournament.finish_game(@random, game)
				tournament.forfeit_notif(game.winner, game.loser, false)
			end
		end
	end

	def my_logger
		@@my_logger ||= Logger.new("#{Rails.root}/log/my.log")
	end

end
