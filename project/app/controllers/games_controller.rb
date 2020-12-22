
class GamesController < ApplicationController

    def index
        @games = Game.all
    end

    def show
        @game = Game.find(params[:id])
        # if (params[:status] == "finished")
        #     return head :not_found
        return head :not_found unless @game
    end

    def join
        @game = Game.find(params[:id])
        return head :not_found unless @game
        @game.update(game_params)
        if @game.save
            @game
        else
            render json: @game.errors, status: :unprocessable_entity
          end
        #return head :unauthorized if current_user.guild.present? || current_user.pending_guild.present?
        @game.user.push(current_user)
    end

    def finish
        @game = Game.find(params[:id])
        return head :not_found unless @game
        @game.update(game_params)
        if @game.save
            @game
        else
            render json: @game.errors, status: :unprocessable_entity
        end
    end
    
    def new
        game = Game.new
    end

    def create
        @game = Game.create(game_params)
        @game.user.push(current_user)
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