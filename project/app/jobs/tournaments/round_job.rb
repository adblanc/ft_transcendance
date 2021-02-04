class RoundJob < ApplicationJob
	queue_as :default

	def perform(tournament)
	  if tournament.round_three?
		tournament.update(status: :finished)
		User.all.each do |user|
			user.send_notification("#{tournament.name} tournament is over. Winner is : XXXX", "tournaments/temporary", "tournaments")
		end
		return
	  end
	  /deal with games + games that are not done/
	  cur_round = tournament.status
      cur_round += 1
      tournament.update(status: cur_round) 
	  tournament.tournament_users.playing.user.each do | user |
		user.send_notification("#{tournament.name} : Round #{cur_round - 1} is starting!", "tournaments/temporary", "tournaments")
	  end
	  @round_length = 1
	  RoundJob.set(wait_until: DateTime.now + @round_length.days).perform_later(tournament)
	end
end