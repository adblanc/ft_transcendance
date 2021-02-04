class TournamentsController < ApplicationController

	def index
		@tournaments = Tournament.all
	end

	def show
		@tournament = Tournament.find_by_id(params[:id])
		return head :not_found unless @tournament
	end

	def create
		return head :unauthorized if not current_user.admin?

		@tournament = Tournament.create(tournament_params)
		if @tournament.save
			create_games(@tournament)
			current_user.add_role :owner, @tournament
			@tournament
			StartRegistrationJob.set(wait_until: @tournament.registration_start).perform_later(@tournament)
		else
			render json: @tournament.errors, status: :unprocessable_entity
		end
	end

	def register
		@tournament = Tournament.find(params[:id])

		return head :unauthorized unless @tournament.open_registration?

		if @tournament.users.count >= 8
			render json: {"Tournament" => ["is full"]}, status: :unprocessable_entity
			return
		elsif @tournament.tournament_users.where(user_id: current_user.id).first
			render json: {"You" => [" are already registered"]}, status: :unprocessable_entity
			return
		end
		@tournament.users.push(current_user)
		@tournament.games.quarter.each do | game |
			if game.users.count < 2
				game.users.push(current_user)
				return
			end
		end
		@tournament
	end

	private

	def tournament_params
		params.permit(:name, :registration_start, :registration_end, :trophy)
	end

	def create_games(tournament)
		tournament.games.push(Game.create(level: :hard, goal: 9, game_type: :tournament, status: :waiting_tournament, tournament_round: :quarter))
		tournament.games.push(Game.create(level: :hard, goal: 9, game_type: :tournament, status: :waiting_tournament, tournament_round: :quarter))
		tournament.games.push(Game.create(level: :hard, goal: 9, game_type: :tournament, status: :waiting_tournament, tournament_round: :quarter))
		tournament.games.push(Game.create(level: :hard, goal: 9, game_type: :tournament, status: :waiting_tournament, tournament_round: :quarter))

		tournament.games.push(Game.create(level: :hard, goal: 9, game_type: :tournament, status: :waiting_tournament, tournament_round: :semi))
		tournament.games.push(Game.create(level: :hard, goal: 9, game_type: :tournament, status: :waiting_tournament, tournament_round: :semi))

		tournament.games.push(Game.create(level: :hard, goal: 9, game_type: :tournament, status: :waiting_tournament, tournament_round: :final))
	end

end
