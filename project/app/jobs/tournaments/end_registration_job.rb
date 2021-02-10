class EndRegistrationJob < ApplicationJob
	queue_as :default

	def perform(tournament)
		return if not tournament.registration?
	  if tournament.users.count != 8
		tournament.update(registration_end: DateTime.now + 12.hours)
		EndRegistrationJob.set(wait_until: tournament.registration_end).perform_later(tournament)
		User.all.each do |user|
			user.send_notification("Registration period extension for #{tournament.name}!", "tournaments/#{tournament.id}", "tournaments")
		end
		return
	  end
	  tournament.update(status: :quarter)
	  tournament.games.quarter.each do | game |
		game.update(status: :pending)
	  end
	  User.all.each do |user|
		user.send_notification("Registrations are closed for #{tournament.name} tournament ! Play your opening matches!", "tournaments/#{tournament.id}", "tournaments")
	  end
	  @round_length = 3
	  RoundJob.set(wait_until: DateTime.now + @round_length.minutes).perform_later(tournament)
	end
end
