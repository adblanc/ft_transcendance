EMPTY_PASSWORD = "empty";

class RoomsController < ApplicationController
	before_action :authenticate_user!

	def index
		@rooms = @current_user.rooms.empty? ? Room.where(is_private: false) : Room.where('id NOT IN (?) AND is_private = false', @current_user.rooms.ids);
	end

	def my_rooms
		@rooms = current_user.rooms
	end

	def create
		@room = Room.create(room_params)

		if @room.save
			@room.users.push(current_user)
			current_user.add_role :owner, @room
			@room
		else
			render json: @room.errors, status: :unprocessable_entity
		  end
	  end

	  def update
		@room = Room.find(params[:id])

		if @room && !@current_user.is_room_owner?(@room)
			render json: {"you" => ["must be owner of this room."]}, status: :unauthorized
		elsif @room
			@room.password = room_password;
			if (@room.save)
				@room
			else
				render json: @room.errors, status: :unprocessable_entity
			end
		else
			render json: {"room" => ["not found."]}, status: :not_found
		end
	  end

	  def join
		@room = Room.find_by(name: room_params[:name])

		if (@room && current_user.rooms.exists?(@room.id))
			render json: {"you" => ["already joined this room."]}, status: :unprocessable_entity
		elsif (@room && (!BCrypt::Password.valid_hash?(@room.password_digest) || @room.try(:authenticate, room_password)))
			@room.users.push(current_user)
			@room
		else
			render json: {"name or password" => ["is incorrect."]}, status: :unprocessable_entity
		end
	end

	def quit
		@room = Room.find_by(name: room_params[:name])

		if (@room && !current_user.rooms.exists?(@room.id))
			render json: {"you" => ["are not in this room."]}, status: :unprocessable_entity
		elsif (!@room)
			render json: {"name" => ["is incorrect"]}, status: :unprocessable_entity
		else
			@room.remove_user(current_user)
		end
	end

	private

	def room_password
		params[:password].blank? ? EMPTY_PASSWORD : params[:password];
	end

	def room_params
		params.permit(:name, :password, :is_private)
	end
end
