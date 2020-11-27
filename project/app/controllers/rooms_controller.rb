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


	  def join
		@room = Room.find_by(name: params[:name])

		begin
			if (params[:password] && @room)
				@room = @room.authenticate(params[:password])
			end
		rescue BCrypt::Errors::InvalidHash
			@room = false;
		end
			if @room
				@room
			else
				render json: {"name or password" => ["is incorrect."]}, status: :unprocessable_entity
			end
	end




	private

	def room_params
		params.require(:room).permit(:name, :password)
	end
end
