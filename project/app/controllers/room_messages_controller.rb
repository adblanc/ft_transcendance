class RoomMessagesController < ApplicationController
	before_action :authenticate_user!
	before_action :load_entities

	def create
		isMute = @room.mutes.find_by(:muted_user_id => @current_user.id);
		if (isMute)
			render json: {"you" => ["are mute in this room"]}, status: :unprocessable_entity
			else
				@room_message = RoomMessage.create(user: current_user, room: @room, content: params[:content])

				ActionCable.server.broadcast("room_#{params[:room_id]}", @room_message);
		end
	end

	protected

  def load_entities
    @room = Room.find params[:room_id]
  end
end
