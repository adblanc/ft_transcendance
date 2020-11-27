class RoomsController < ApplicationController
	def index
		@rooms = Room.all
	end

	def new
		@room = Room.new
	end

	def create
		logger = Logger.new(STDOUT)

		logger.info(params)
		@room = Room.create(room_params)

		@room.users.push(current_user)

		if @room.save
			@room
		else
			render json: @room.errors, status: :unprocessable_entity
		  end
	  end


	  def join
		logger = Logger.new(STDOUT)

		logger.info(params)
		@room = Room.find_by(name: room_params[:name])

		begin
			if (room_params[:password] && @room)
				@room = @room.authenticate(room_params[:password])
			end
		rescue BCrypt::Errors::InvalidHash
			@room = false;
		end
			if @room
				@room.users.push(current_user) if !current_user.rooms.exists?(@room.id)
				logger = Logger.new(STDOUT)

				logger.debug(@room.users)
				@room
			else
				render json: {"name or password" => ["is incorrect."]}, status: :unprocessable_entity
			end
	end




	private

	def room_params
		params.permit(:name, :password)
	end
end
