class GamingChannel < ApplicationCable::Channel

  def my_logger
    @@my_logger ||= Logger.new("#{Rails.root}/log/my.log")
  end

  def subscribed
      @id = params[:id]
      @game = Game.find_by_id(@id)

      reject unless @game

      stream_from "game_#{@id}"

      my_logger.debug("==== subscribe, game status : #{@game.status}, player: #{current_user.id} ====")

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
    my_logger.debug("=== game_continue  #{@game.status} player: #{current_user.id} ====")
    if (current_user.is_playing_in?(@game) && @game.paused?)
      @game.check_user_paused(current_user);
    end
  end

  def game_paused
    @game.reload
    my_logger.debug("=== game_paused #{@game.status} player: #{current_user.id} ====")
    if (current_user.is_playing_in?(@game) && @game.started?)
      @game.user_paused(current_user);
    end
  end

  def unsubscribed
    my_logger.debug("=== on unsubscribe game status #{@game.status} player: #{current_user.id} ====")
      self.game_paused
  end
end
