class GamingChannel < ApplicationCable::Channel

  def subscribed
      @id = params[:id]
      @game = Game.find_by_id(@id)


      if !@game or @game.finished?
        reject
      end

      stream_from "game_#{@id}"

     self.game_continue
  end

  def player_movement(data)
     if (current_user.is_playing_in?(@game) && @game.started?)
      ActionCable.server.broadcast("game_#{@id}", data);
     end
  end

  def player_score(data)
    if (current_user.is_playing_in?(@game) && @game.started?)
      @game.player_score(data);
     end
  end

  def game_continue
    @game.reload
    if (current_user.is_playing_in?(@game) && @game.paused?)
      @game.check_user_paused(current_user);
    end
  end

  def game_paused
    @game.reload
    if (current_user.is_playing_in?(@game) && @game.started?)
      @game.user_paused(current_user);
    end
  end

  def game_started
  	current_user.appear("in_game")
    @game.reload
  end

  def unsubscribed
      self.game_paused
  end
end
