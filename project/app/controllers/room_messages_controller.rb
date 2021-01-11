class RoomMessagesController < ApplicationController
	before_action :authenticate_user!
	before_action :load_entities

	def create
		if (@current_user.is_room_mute?(@room))
			render json: {"you" => ["are mute in this room"]}, status: :unprocessable_entity
		elsif (@current_user.is_room_ban?(@room))
			render json: {"you" => ["are ban in this room"]}, status: :unprocessable_entity
			else
				SendMessageJob.perform_now(current_user, @room, params[:content]);
		end
	end

	protected

  def load_entities
    @room = Room.find params[:room_id]
  end
end
