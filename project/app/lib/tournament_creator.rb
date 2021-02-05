class TournamentCreator
	def self.cron_create
		date = DateTime.now
		begin
			tournament = Tournament.create!(
				name: date.strftime("Week %W"),
				registration_start: date,
				registration_end: date + 1.days,
				status: :registration,
			)
#			StartRegistrationJob.set(wait_until: tournament.registration_start)
#				.perform_later(tournament)
			create_tournament_games(tournament)
		rescue
			puts "Failed to add new auto-tournament"
		end
	end

    def self.create_tournament_games(tournament)
        create_games(tournament, :quarter, 4)
        create_games(tournament, :semi, 2)
        create_games(tournament, :final, 1)
    end

	private
    def self.create_games(tournament, round, number)
		number.times do
			tournament.games.push(Game.create(
				level: :hard,
				goal: 9,
				game_type: :tournament,
				status: :waiting_tournament,
				tournament_round: round
			))
		end
    end

end
