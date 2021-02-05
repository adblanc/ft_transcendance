class TournamentCreator
	def self.cron_create
		date = DateTime.now
		begin
			Tournament.create!(
				name: date.strftime("Week %W"),
				registration_start: date,
				registration_end: date + 1.days,
			)
		rescue => e
			puts "Failed to add new auto-tournament: #{e.inspect}"
		end
	end
end
