class RoomMessagesController < ApplicationController
	before_action :load_entities

	def create
		@room_message = RoomMessage.create(user: current_user, room: @room, content: params[:content])

		ActionCable.server.broadcast("room_#{params[:room_id]}", @room_message);
	end

	protected

  def load_entities
    @room = Room.find params[:room_id]
  end
end
