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
			current_user.add_role :owner, @tournament
			@tournament
			StartRegistrationJob.set(wait_until: @tournament.registration_start).perform_later(@tournament)
		else
			render json: @tournament.errors, status: :unprocessable_entity
		end
	end

	def register
		/not if max/
		/not if already registered to the tournament/
	end

	def unregister
	end

	private

	def tournament_params
		params.permit(:name, :registration_start, :registration_end, :trophy)
	end

end