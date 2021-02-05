class EndRegistrationJob < ApplicationJob
	queue_as :default

	def perform(tournament)
		return if not tournament.registration?
	  if tournament.users.count != 8
		tournament.update(registration_end: DateTime.now + 12.hours)
		EndRegistrationJob.set(wait_until: tournament.registration_end).perform_later(tournament)
		User.all.each do |user|
			user.send_notification("Registration period extension for #{tournament.name}!", "tournaments/temporary", "tournaments")
		end
		return
	  end
	  tournament.update(status: :round_one)
	  tournament.games.quarter.each do | game |
		game.update(status: :pending)
	  end
	  User.all.each do |user|
		user.send_notification("Registrations are closed for #{tournament.name} tournament ! Play your opening matches!", "tournaments/temporary", "tournaments")
	  end
	  @round_length = 1
	  RoundJob.set(wait_until: DateTime.now + @round_length.days).perform_later(tournament)
	end
end
