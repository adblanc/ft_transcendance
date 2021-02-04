class TournamentCreator
	def self.create_tournament
		@date = DateTime.now
		@tournament = Tournament.create(
			name: @date.strftime("Week %W"),
			registration_start: @date,
			registration_end: @date + 1.days,
		)
		if @tournament.save
#			self.create_games
			StartRegistrationJob.set(wait_until: @tournament.registration_start)
				.perform_later(@tournament)
		else
			File.open("/app/log/cron.log", "a") do |file|
				file.puts "Failed to add new auto-tournament"
			end
		end
	end

end
