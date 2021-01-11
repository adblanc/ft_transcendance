class GamingChannel < ApplicationCable::Channel
  def subscribed
     game_id = params[:game_id];
     stream_from "game_#{game_id}"

    # mouv = GameMouv.where(game_id: game_id).order(created_at: :asc).each do |mouv|
    #   transmit(mouv)
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
