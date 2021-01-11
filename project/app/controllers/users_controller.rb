class UsersController < ApplicationController
  before_action :authenticate_user!

  def show
    @current_user
  end

  def update
    if @current_user.update(user_params)
        @current_user
    else
      render json: @current_user.errors, status: :unprocessable_entity
    end
  end

  def show_other_user
  	if (@other_user = User.find_by_id(params[:id]))
		@other_user
	else
		render json: { "user" => ["not found"] }, status: :unprocessable_entity
	end
  end

  def update_room_role
		@room = Room.find(params[:room_id])

		if !@room
			render json: {"room" => ["not found"]}, status: :not_found and return;
		elsif !@current_user.is_room_owner?(@room)
			render json: {"you" => ["must be owner of this room"]}, status: :unauthorized and return;
		end

		@user_to_update = User.find(params[:user_id]);

		action = params[:update_action];

		if !@user_to_update
			render json: {"user" => ["not found"]}, status: :not_found and return;
		elsif !(@room.users.exists?(@user_to_update.id))
			render json: {"user" => ["not found in this room"]}, status: :not_found and return;
		elsif !(@room.valid_update_role_action(action))
			render json: {"you" => ["must provide a valid action"]}, status: :unprocessable_entity and return;
		end

		@room.update_user_role(@user_to_update, action)
		@room.send_room_notification(action, @current_user, @user_to_update, nil)

		@user_to_update;
	end

  private

  def user_params
    params.permit(:name, :avatar, :email, :two_fact_auth)
  end
end
