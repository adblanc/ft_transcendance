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

  def update_room_role
		@room = Room.find(params[:room_id])

		if !@room
			render json: {"room" => ["not found."]}, status: :not_found and return;
		elsif !@current_user.is_room_owner?(@room)
			render json: {"you" => ["must be owner of this room."]}, status: :unauthorized and return;
		end

		@user_to_update = User.find(params[:user_id]);

		action = params[:update_action];

		if !@user_to_update
			render json: "Please provide a valid user_id", status: :unprocessable_entity and return;
		elsif !valid_update_role_action(action)
			render json: "Please provide a valid action", status: :unprocessable_entity and return;
		end

		@room.update_user_role(@user_to_update, action)

		@user_to_update;
	end

  private

  def valid_update_role_action(action)
    logger = Logger.new(STDOUT)
    logger.info("action : #{action}")
		!action.blank? && (action === "promote" || action === "demote");
	end

  def user_params
    params.permit(:name, :avatar)
  end
end
