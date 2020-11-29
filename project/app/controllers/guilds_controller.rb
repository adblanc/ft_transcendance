class GuildsController < ApplicationController
  def index
	@guilds = Guild.all
  end

  def show
	@guild = Guild.find(params[:id])
  end

  def new
	guild = Guild.new
  end

  def create
	@guild = Guild.create(guild_params)
	@guild.users.push(current_user)
	current_user.add_role :owner, @guild
	if @guild.save
		@guild
	else
		render json: @guild.errors, status: :unprocessable_entity
  	end
  end

  def edit
    @guild = Guild.find(params[:id])
  end

  def update
    @guild = Guild.find(params[:id])
	@guild.update(guild_params)
	if @guild.save
		@guild
	else
		render json: @guild.errors, status: :unprocessable_entity
  	end
  end

  def destroy
	@guild = Guild.find(params[:id])
	@guild.destroy
  end

  def quit
	@guild = Guild.find(params[:id])
	@guild.remove_user(current_user)
  end

  def promote
    @guild = Guild.find_by(id: params[:id])
    user = User.find(params[:user_id])
    user.add_role(:officer, @guild)
  end

  private

  def guild_params
	params.permit(:name, :ang, :img)
  end
end