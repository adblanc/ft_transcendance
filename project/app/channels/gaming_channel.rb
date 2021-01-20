class GamingChannel < ApplicationCable::Channel
  def subscribed
      @id = params[:id]
      stream_from "game_#{@id}"
  end

  def player_movement(data) # ici on recoit ce que un autre joueur perform
    # broadcast to all game users the movements
     ActionCable.server.broadcast("game_#{@id}", data);
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
