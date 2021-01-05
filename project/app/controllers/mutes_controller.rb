# TODO

# Verifier que l'user qu'on veut mute fait bien parti du room

class MutesController < ApplicationController
	before_action :authenticate_user!

	def mute
		@room = Room.find_by_id(params[:room_id])
		@muted_user = User.find_by_id(params[:id]);

		if (!@muted_user)
			render json: {"user" => ["does not exist"]}, status: :unprocessable_entity
		elsif (!@room)
			render json: {"room" => ["does not exist"]}, status: :unprocessable_entity
		else
			if (!@current_user.is_room_owner?(@room))
				render json: {"you" => ["must be owner of this room"]}, status: :unprocessable_entity
			elsif (@room.mutes.where(muted_user_id: params[:id]).take)
				render json: {"User" => ["is already muted"]}, status: :unprocessable_entity
			else
				@mute = @room.mutes.build(:muted_user_id => params[:id])
				if (@mute.save)
					UnmuteRoomUserJob.set(wait: 30.minutes).perform_later(@mute)
					@muted_user
				else
					render json: @mute.errors, status: :unprocessable_entity
				end
			end
		end

	end

	def unmute

	end

  end
