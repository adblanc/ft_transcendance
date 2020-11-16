class GuildsController < ApplicationController
  def index
	render json: @guilds = Guild.all
  end

  def show
	@guild = Guild.find(params[:id])
	render json: @guild
  end

  def new
	guild = Guild.new
  end

  def create
	@guild = Guild.create(guild_params)
	if @guild.save
		@guild
	else
		render json: @guild.errors, status: :unprocessable_entity
  end

end

  def edit
  end

  private

  def guild_params
	params.require(:guild).permit(:name, :ang)
  end
end
