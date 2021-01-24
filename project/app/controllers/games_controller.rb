
class GamesController < ApplicationController

	def index
		@games = Game.all
	end

    def show
        @game = Game.find_by_id(params[:id])
        return head :not_found unless @game
    end

	def create
		return head :unauthorized if current_user.inGame? || current_user.pendingGame?
		@games = Game.where(status: :pending)
		@games.to_ary.each do | game |
			if game.goal == params[:goal].to_i && game.level == params[:level] && game.game_type == params[:game_type] 
				game.users.push(current_user)
				game.update(status: :started)
				@game = game
				ActionCable.server.broadcast("game_#{@game.id}", {"event" => "started"});
				return @game
			end
		end
		@game = Game.create(game_params)
        if @game.save
			@game.users.push(current_user)
			@expire = 5
			ExpireGameJob.set(wait_until: DateTime.now + @expire.minutes).perform_later(@game, nil)
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
	
	def challenge
		@warTime = WarTime.find_by_id(params[:warTimeId])
		@war = @warTime.war
		@guild = Guild.find_by_id(current_user.guild.id)
		@opponent = @war.opponent(@guild)

		return head :unauthorized if not @guild.atWar? || @opponent.atWar? || @war.atWarTime?
		return head :unauthorized if @warTime.activeGame || @warTime.pendingGame
		return head :unauthorized if current_user.inGame? || current_user.pendingGame

		@game = Game.create(game_params)

		if @game.save
			@game.update(war_time: @warTime)
			@game.users.push(current_user)
			@guild.members.each do |member|
				if not member == current_user
					member.send_notification("#{current_user.name} from your Guild has challenged #{@opponent.name} to a War Time match!", "/wars", "war")
				end
			end
			@opponent.members.each do |member|
				member.send_notification("#{current_user.name} has challenged your Guild to a War Time match! Answer the call!", "/wars", "war")
			end
			ExpireWarTimeGameJob.set(wait_until: DateTime.now + @war.time_to_answer.minutes).perform_later(@game, @guild, @opponent, @warTime, current_user)
			@game
		else
			render json: @game.errors, status: :unprocessable_entity
		end
	end

	def acceptChallenge
		@game = Game.find_by_id(params[:id])
		@warTime = @game.war_time
		@war = @warTime.war
		@guild = Guild.find_by_id(current_user.guild.id)
		@opponent = @war.opponent(@guild)

		return head :unauthorized if not @guild.atWar? || @opponent.atWar? || @war.atWarTime?
		return head :unauthorized if @warTime.activeGame
		return head :unauthorized if current_user.inGame? || current_user.pendingGame

		@game.users.push(current_user)
		@game.update(status: :started)
		ActionCable.server.broadcast("game_#{@game.id}", {"event" => "started"});

		/faire link vers match/
		@guild.members.each do |member|
			if not member == current_user
				member.send_notification("#{current_user.name} from your Guild has accepted a War Time challenge against #{@opponent.name} !", "/wars", "war")
			end
		end
		@opponent.members.each do |member|
			member.send_notification("#{current_user.name} has accepted your Guild's War Time challenge", "/wars", "war")
		end
		@game
	end

	def playChat
		return head :unauthorized if current_user.inGame? || current_user.pendingGame
		@room = Room.find_by_id(params[:room_id])
		@game = Game.create(game_params)
		if @game.save
			@game.update(game_type: :chat)
			@game.users.push(current_user)
			@expire = 1
			ExpireGameJob.set(wait_until: DateTime.now + @expire.minutes).perform_later(@game, @room)
			ActionCable.server.broadcast("room_#{@room.id}", {"event" => "playchat"});
			@game
		else
			render json: @game.errors, status: :unprocessable_entity
		end
	end

	def acceptPlayChat
		return head :unauthorized if current_user.inGame? || current_user.pendingGame

		@game = Game.find_by_id(params[:id])
		return head :unauthorized if not @game.pending?

		@game.users.push(current_user)
		@game.update(status: :started)
		ActionCable.server.broadcast("game_#{@game.id}", {"event" => "started"});
		@game
	end

	private
    def game_params
        params.permit(:level, :goal, :game_type)
	end
end
