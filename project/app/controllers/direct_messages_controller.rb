EMPTY_PASSWORD = "empty"

class DirectMessagesController < ApplicationController
	before_action :authenticate_user!

	def index
		@dms = Room.where('id IN (?) AND is_dm = true', @current_user.rooms.ids);
	end

	def create
		@target_user = User.find_by_id(params[:user_id]);

		if (!@target_user)
			render json: {"user" => ["does not exist"]}, status: :unprocessable_entity
		else
			@room = Room.create(name: "#{@current_user.id}|#{@target_user.id}",
				password: EMPTY_PASSWORD, is_dm: true, is_private: true)

			if @room.save
				@room.users.push(@current_user)
				@room.users.push(@target_user)
				@room
			else
				render json: @room.errors, status: :unprocessable_entity
			  end
		end
	end

end
