class RoomsController < ApplicationController
	def index
		@rooms = Room.all
	end

	def new
		@room = Room.new
	end

	def create
		@room = Room.create(room_params)
		if @room.save
			@room
		else
			render json: @room.errors, status: :unprocessable_entity
		  end
	  end


	private

	def room_params
		params.require(:room).permit(:name, :password)
	end
end
