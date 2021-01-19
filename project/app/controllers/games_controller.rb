
class GamesController < ApplicationController

	def index
		@games = Game.all
	end

    def show
        @game = Game.find_by_id(params[:id])
        return head :not_found unless @game
    end

	def create
		return head :unauthorized if current_user.inGame? 
		@games = Game.where(status: :pending)
		@games.to_ary.each do | game |
			if game.goal == params[:goal].to_i && game.level == params[:level] && game.game_type == params[:game_type] 
				game.users.push(current_user)
				game.update(status: :started)
				@game = game
				ActionCable.server.broadcast("game_#{@game.id}", {"event" => "started"});
				Delayed::Job.all.each do |job|
					job.destroy if job_corresponds_to_target?(job, @game)
				end
				return @game
			end
		end
		@game = Game.create(game_params)
        if @game.save
			@game.users.push(current_user)
			@expire = 5
			ExpireGameJob.set(wait_until: DateTime.now + @expire.minutes).perform_later(@game)
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
        params.permit(:level, :goal, :game_type)
	end
	def job_corresponds_to_target?(job, target)
		job.payload_object.args.first == target.id
	end
end
