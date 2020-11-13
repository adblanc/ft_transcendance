class GuildsController < ApplicationController
  before_action :authenticate_user!

  def index
	@guilds = Guild.all
  end

  def show
	render json: @guild # = Guild.find(params[:id])
  end

  def new
	@guild = Guild.new
  end

  def create
	guild = Guild.create(guild_params)

	redirect_to_guilds_path
  end

  def editPoints
  end

  def editMembers
  end

  def editatWar
  end

  def editWarLog
  end

  def guild_params
    params.require(:guild).permit(:name, :ang)
  end
end
