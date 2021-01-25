class RoomChannel < ApplicationCable::Channel
  def subscribed
    room_id = params[:room_id];
    stream_from "room_#{room_id}"

    room = Room.find_by_id(room_id);

    if (room && (room.users.exists?(current_user.id) || current_user.admin?) && !current_user.is_room_ban?(room))
      messages = RoomMessage.where(room_id: room_id).order(created_at: :asc).each do |message|
        transmit({"message" => message.as_json(nil).merge(:ancient => true)})
      end
    end
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
