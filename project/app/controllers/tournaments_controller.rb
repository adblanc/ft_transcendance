class TournamentsController < ApplicationController
	def index
		/see if i need all or just pending/
		@tournaments = War.where(status: :pending)
	end

	def show
		@war = War.find_by_id(params[:id])
		return head :not_found unless @war
	end

	def create
	end

	def cancel
	end

	def register
	end

	def unregister
	end

	private

	def war_params
		params.permit()
	end

end