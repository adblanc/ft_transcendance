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


  private

  def user_params
    params.permit(:name, :avatar)
  end
end
