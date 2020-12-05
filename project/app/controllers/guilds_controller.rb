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
	@guild.users.each do |user|
		user.update(contribution: 0)
	end
	@guild.destroy
  end

  def quit
	@guild = Guild.find(params[:id])
	if @guild.remove_user(current_user)
		@guild
	end
  end

  def promote
    @guild = Guild.find_by(id: params[:id])
    user = User.find(params[:user_id])
	if user.add_role(:officer, @guild)
		@guild
	end
	user.send_notification(current_user, "promoted you to Officer for", @guild)
  end

  def demote
    @guild = Guild.find_by(id: params[:id])
    user = User.find(params[:user_id])
	if user.remove_role(:officer, @guild)
		@guild
	end
	user.send_notification(current_user, "demoted you to Member for", @guild)
  end

  def fire
    @guild = Guild.find_by(id: params[:id])
    user = User.find(params[:user_id])
	if @guild.remove_user(user)
		@guild
	end
	user.update(contribution: 0)
	user.send_notification(current_user, "fired you from", @guild)
  end

  def transfer
    @guild = Guild.find_by(id: params[:id])
	user = User.find(params[:user_id])
	owner = User.with_role(:owner, @guild).first
	user.add_role(:owner, @guild)
	owner.remove_role(:owner, @guild)
	if owner.add_role(:officer, @guild)
		@guild
	end
	user.send_notification(current_user, "transferred you ownership for", @guild)
  end

  private

  def guild_params
	params.permit(:name, :ang, :img)
  end
end