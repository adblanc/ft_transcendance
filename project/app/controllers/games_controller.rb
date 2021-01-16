
class GamesController < ApplicationController

	def index
		@games = Game.all
	end

    def show
        @game = Game.find_by_id(params[:id])
        return head :not_found unless @game
    end

	def create
		@games = Game.where(status: :pending)
		@games.to_ary.each do | game |
			if game.goal == params[:goal].to_i && game.level == params[:level]
				game.users.push(current_user)
				game.update(status: :started)
				@game = game
				/ActionCable.broadcast-> game channel started/
				ActionCable.server.broadcast("game_#{@game.id}", {"event" => "started"});
				/PlayGameJob.perform_now(game)/
				return @game
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
			@game.update(status: :finished)
		end
    end

	private
    def game_params
        params.permit(:level, :goal)
    end
end
