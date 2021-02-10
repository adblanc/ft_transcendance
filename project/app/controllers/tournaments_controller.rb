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

		@tournament = Tournament.new(tournament_params)
		if @tournament.save
			current_user.add_role :owner, @tournament
			@tournament
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
				game.game_users.where(user: current_user).update(status: :pending)
				return
			end
		end
		@tournament
	end

	def seed_for_test
		@tournament = Tournament.find(params[:id])
		@tournament.users.push(User.find(1))
		game_seed_for_test(@tournament, User.find(1))
		@tournament.users.push(User.find(2))
		game_seed_for_test(@tournament, User.find(2))
		@tournament.users.push(User.find(3))
		game_seed_for_test(@tournament, User.find(3))
		@tournament.users.push(User.find(4))
		game_seed_for_test(@tournament, User.find(4))
		@tournament.users.push(User.find(5))
		game_seed_for_test(@tournament, User.find(5))
		@tournament.users.push(User.find(6))
		game_seed_for_test(@tournament, User.find(6))
		@tournament.users.push(User.find(7))
		game_seed_for_test(@tournament, User.find(7))
		@tournament.users.push(User.find(8))
		game_seed_for_test(@tournament, User.find(8))
		@tournament
	end

	def game_seed_for_test(tournament, user)
		tournament.games.quarter.each do | game |
			if game.users.count < 2
				game.users.push(user)
				game.game_users.where(user: user).update(status: :pending)
				return
			end
		end
	end

	private
	def tournament_params
		params.permit(:name, :registration_start, :registration_end, :trophy)
	end
end
