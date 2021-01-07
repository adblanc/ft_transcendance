
class GamesController < ApplicationController

    def index
        @games = Game.all
    end

    def show
        @game = Game.find(params[:id])
        @gameuserone = GameUser.where(game: @game, user: current_user).first
        # if (params[:status] == "finished")
        #     return head :not_found
        return head :not_found unless @game
    end

    def join
        @game = Game.find(params[:id])
        return head :not_found unless @game
        @game.update(game_params)
        if @game.save
            @gameuser = GameUser.create!(game: @game, user: current_user, points: 0)
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
        @game.update_attribute(:status, "finished")
        if @game.save
            @gameuserone = GameUser.where(game: @game, user: current_user).first
            #@gameuserone.update_attribute(:points, 2)
           # if @gameuserone.update_attribute(:points, params[:points])
           #     @gameuserone
          #  else
         #       render json: @game.errors, status: :unprocessable_entity
          #  #same avec le  deuxieme
            #@gameuserone.update_attribute(:points, game_params[:points])
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
            @gameuser = GameUser.create!(game: @game, user: current_user, points: 0)
            @game
        else
            render json: @game.errors, status: :unprocessable_entity
        end
    end
private
    def game_params
        params.permit(:id, :level, :points, :status, :first, :second)
    end
    def game_user_params
        params.permit(:game, :user, :player_points)
    end
end