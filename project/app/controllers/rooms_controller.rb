EMPTY_PASSWORD = "empty";

class RoomsController < ApplicationController
	before_action :authenticate_user!

	def index
		@rooms = @current_user.rooms.empty? ? Room.where(is_private: false) : Room.where('id NOT IN (?) AND is_private = false', @current_user.rooms.ids);
	end

	def show
		@room = Room.find_by_id(params[:id]);

		if (@room)
			@room
		else
			render json: {"room" => ["not found."]}, status: :not_found
		end
	end

	def my_rooms
		@rooms =  @current_user.rooms.select { |room| !@current_user.is_room_ban?(room) }
	end

	def create
		if (room_params[:name].blank?)
			render json: {"name" => ["can't be blank"]}, status: :unprocessable_entity	and return;
		end

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
		@room = Room.find_by_id(params[:id])

		if @room && !@current_user.is_room_owner?(@room)
			render json: {"you" => ["must be owner of this room."]}, status: :unprocessable_entity
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
		if (room_params[:name].blank?)
			render json: {"name" => ["can't be blank"]}, status: :unprocessable_entity	and return;
		end

		@room = Room.find_by(name: room_params[:name])

		if (@room && @current_user.is_room_ban?(@room))
			render json: {"you" => ["are banned from this room."]}, status: :unprocessable_entity
		elsif (@room && @room.is_dm)
			render json: {"you" => ["can't join this room."]}, status: :unprocessable_entity
		elsif (@room && (!BCrypt::Password.valid_hash?(@room.password_digest) || @room.try(:authenticate, room_password)))
			if (!current_user.rooms.exists?(@room.id))
				@room.users.push(current_user)
			end
			@room.send_room_notification("join", @current_user, @current_user, nil)
			@room
		else
			render json: {"name or password" => ["is incorrect."]}, status: :unprocessable_entity
		end
	end

	def quit
		@room = Room.find_by_id(params[:id])

		if (!@room)
			return;
		elsif (@room && !current_user.rooms.exists?(@room.id))
			render json: {"you" => ["are not in this room."]}, status: :unprocessable_entity
		elsif (@current_user.is_room_ban?(@room));
			render json: {"action" => ["left"]}, status: :ok
		else
			if (@room.remove_user(current_user) === "left")
				@room.send_room_notification("left", @current_user, @current_user, nil)
				render json: {"action" => ["left"]}, status: :ok
			else
				render json: {"action" => ["deleted"]}, status: :ok
			end
		end
	end

	def init_direct_messages
		@target_user = User.find_by_id(params[:user_id]);

		if (!@target_user)
			render json: {"user" => ["does not exist"]}, status: :unprocessable_entity
		elsif (@room = Room.where('id IN (?) AND id IN (?) AND is_dm = true', @current_user.rooms.ids, @target_user.rooms.ids).take)
			@room
		else
			@room = Room.create(name: "",
				password: EMPTY_PASSWORD, is_dm: true, is_private: true)

			if @room.save
				@room.users.push(@current_user)
				@room.users.push(@target_user)

				@target_user.send_notification("#{@current_user.name} created a conversation with you", "");
				@room
			else
				render json: @room.errors, status: :unprocessable_entity
			  end
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
