
class GamesController < ApplicationController

    def index
        @games = Game.all
    end

    def show
        @game = Game.find(params[:id])
        return head :not_found unless @game
    end
    
    def new
        game = Game.new
    end

    def create
        @game = Game.create(game_params)
        @game.users.push(current_user)
       #current_user.add_role :owner, @game
        if @game.save
            @game
        else
            render json: @game.errors, status: :unprocessable_entity
        end
    end
private
    def game_params
        params.permit(:id, :level, :points, :status)
    end
end