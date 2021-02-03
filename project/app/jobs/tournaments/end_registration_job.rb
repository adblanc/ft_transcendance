class EndRegistrationJob < ApplicationJob
	queue_as :default

	def perform(tournament)
	  tournament.update(status: :round_one)
	  User.all.each do |user|
		user.send_notification("Registrations are closed for #{tournament.name} tournament ! Play your opening matches!", "tournaments/temporary", "tournaments")
	  end
	  @round_length = 1
	  RoundJob(wait_until: DateTime.now + @round_length.days).perform_later(tournament)
	end
end
