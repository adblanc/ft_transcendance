
class GamesController < ApplicationController

    def show
        @game = Game.find_by_id(params[:id])
        return head :not_found unless @game
    end

	def create
		@games = Games.where(status: :pending)
		@games.each do | game |
			if game.goal == params[:goal] && game.level == params[:level]
				game.users.push(current_user)
				game.update(status: :started)
				PlayGameJob.perform_now(self)
				return game
			end
		end
		@game = Game.create(game_params)
        if @game.save
			@game.users.push(current_user)
			@game
        else
            render json: @game.errors, status: :unprocessable_entity
        end
	end
	
    def score
		@game = Game.find_by_id(params[:id])
		return head :not_found unless @game
		@player = GameUser.where(id: params[:user_id])
		@player.points.increment!
		if @player.points == @game.goal
			@game.update(:status :finished)
    end
    
private
    def game_params
        params.permit(:level, :goal)
    end
end