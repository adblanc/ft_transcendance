class GuildsController < ApplicationController
  def index
	render json: @guilds = Guild.all
  end

  def show
	@guild = Guild.find(params[:id])
	render json: @guild
  end

  def new
  end

  def edit
  end
end
