class TournamentCreator
	def self.cron_create
		date = DateTime.now
		begin
			tournament = Tournament.create!(
				name: date.strftime("Week %W"),
				registration_start: date,
				registration_end: date + 2.minutes,
			)
			StartRegistrationJob.perform_now(tournament)
		rescue => e
			puts "Failed to add new auto-tournament: #{e.inspect}"
		end
	end
end
