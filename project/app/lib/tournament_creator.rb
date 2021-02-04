class TournamentCreator
	def self.cron_create
		date = DateTime.now
		tournament = Tournament.create(
			name: date.strftime("Week %W"),
			registration_start: date,
			registration_end: date + 1.days,
			status: :registration,
		)
		if tournament.save
#			StartRegistrationJob.set(wait_until: tournament.registration_start)
#				.perform_later(tournament)
			create_tournament_games(tournament)
		else
			File.open("/app/log/cron.log", "a") do |file|
				file.puts "Failed to add new auto-tournament"
			end
		end
	end

    def self.create_tournament_games(tournament)
        create_games(tournament, :quarter, 4)
        create_games(tournament, :semi, 2)
        create_games(tournament, :final, 1)
    end

	private
    def self.create_games(tournament, round, number)
		File.open("/app/log/cron.log", "a") do |file|
            file.puts "#{tournament}, #{Game.class}, #{tournament.games}, #{round}, #{number}"
        end
		number.times do
			File.open("/app/log/cron.log", "a") do |file|
				file.puts "loop begin"
			end
			tournament.games.push(Game.create(
			    level: :hard,
			    goal: 9,
			    game_type: :tournament,
			    status: :waiting_tournament,
			    tournament_round: round
			))
			File.open("/app/log/cron.log", "a") do |file|
				file.puts "loop end"
			end
		end
    end

end
