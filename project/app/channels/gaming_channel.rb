class GamingChannel < ApplicationCable::Channel
  def subscribed
      @id = params[:id]
      @game = Game.find_by_id(@id)

      reject unless @game

      stream_from "game_#{@id}"

     self.game_continue
  end

  def player_movement(data) # ici on recoit ce que un autre joueur perform
    # broadcast to all game users the movements
     if (current_user.is_playing_in?(@game))
      ActionCable.server.broadcast("game_#{@id}", data);
     end
  end

  def player_score(data)
    if (current_user.is_playing_in?(@game))
      @game.player_score(data);
     end
  end

  def game_continue
    if (current_user.is_playing_in?(@game) && @game.paused?)
      @game.check_user_paused(current_user);
    end
  end

  def game_paused
    if (current_user.is_playing_in?(@game) && @game.started?)
      @game.user_paused(current_user);
     end
  end

  def unsubscribed
      self.game_paused
  end
end
