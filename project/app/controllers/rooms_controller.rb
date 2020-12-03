class RoomsController < ApplicationController
	def index
		@rooms = current_user.rooms if current_user
	end

	def create
		@room = Room.create(room_params)

		@room.users.push(current_user)

		if @room.save
			@room
		else
			render json: @room.errors, status: :unprocessable_entity
		  end
	  end


	  def join
		@room = Room.find_by(name: room_params[:name])

		if (@room && current_user.rooms.exists?(@room.id))
			render json: {"you" => ["already joined this room."]}, status: :unprocessable_entity
		else
			begin
				if (!(room_params[:password].nil? || room_params[:password].empty?) && @room)
					@room = @room.authenticate(room_params[:password])
				end
			rescue BCrypt::Errors::InvalidHash
				@room = false;
			end
				if @room
					@room.users.push(current_user)
					@room
				else
					render json: {"name or password" => ["is incorrect."]}, status: :unprocessable_entity
				end
		end
	end




	private

	def room_params
		params.permit(:name, :password)
	end
end
