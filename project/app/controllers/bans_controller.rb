# TODO

# Verifier que l'user qu'on veut mute fait bien parti du room

class BansController < ApplicationController
	before_action :authenticate_user!

	def ban
		@room = Room.find_by_id(params[:room_id])
		@banned_user = User.find_by_id(params[:id]);

		if (!@banned_user)
			render json: {"user" => ["does not exist"]}, status: :unprocessable_entity
		elsif (!@room)
			render json: {"room" => ["does not exist"]}, status: :unprocessable_entity
		else
			if (!@current_user.is_room_owner?(@room))
				render json: {"you" => ["must be owner of this room"]}, status: :unprocessable_entity
			elsif (@room.bans.where(banned_user_id: params[:id]).take)
				render json: {"User" => ["is already banned"]}, status: :unprocessable_entity
			else
				@ban = @room.bans.build(:banned_user_id => params[:id])
				if (@ban.save)
					UnbanRoomUserJob.set(wait: 30.minutes).perform_later(@ban)
					@banned_user
				else
					render json: @ban.errors, status: :unprocessable_entity
				end
			end
		end

	end

	def unban

	end

  end
