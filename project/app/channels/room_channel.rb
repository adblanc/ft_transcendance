class RoomChannel < ApplicationCable::Channel
  def subscribed
    room_id = params[:room_id];
    stream_from "room_#{room_id}"

    messages = RoomMessage.where(room_id: room_id).order(created_at: :asc).each do |message|
      transmit(message)
    end
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
