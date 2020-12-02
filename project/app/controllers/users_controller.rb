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

  def promote
	@guild = self.guild
	@user.add_role(:officer, @guild)
  end

  def notifications
    notifications = current_user.notifications
    render json: { notifications: notifications.order(created_at: :desc).select(:id, :actor, :action, :notifiable).to_ary }
  end


  private

  def user_params
    params.permit(:name, :avatar)
  end
end
