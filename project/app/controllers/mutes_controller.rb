class MutesController < ApplicationController
	before_action :authenticate_user!
	before_action :load_entities

	def mute
		if (!correct_req)
			return;
		end

		if (!@current_user.is_room_owner?(@room))
			render json: {"you" => ["must be owner of this room"]}, status: :unprocessable_entity
		elsif (@room.mutes.exists?(muted_user_id: params[:id]))
			render json: {"User" => ["is already muted"]}, status: :unprocessable_entity
		else
			@mute = @room.mutes.build(:muted_user_id => params[:id])
			if (@mute.save)
				@room.send_room_notification("has been muted by #{@current_user.login}", @current_user, @muted_user)
				UnmuteRoomUserJob.set(wait: 30.minutes).perform_later(@mute)
				@muted_user
			else
				render json: @mute.errors, status: :unprocessable_entity
			end
		end
	end

	def unmute
		if (!correct_req)
			return;
		end
		if (!@current_user.is_room_owner?(@room))
			render json: {"you" => ["must be owner of this room"]}, status: :unprocessable_entity
		elsif !(@mute = @room.mutes.where(muted_user_id: params[:id]).take)
			render json: {"User" => ["is not muted"]}, status: :unprocessable_entity
		else
			@room.send_room_notification("has been unmuted by #{@current_user.login}", @current_user, @muted_user)
			UnmuteRoomUserJob.perform_now(@mute)
			@muted_user
		end
	end

	private

	def correct_req
		if (!@muted_user)
			render json: {"user" => ["does not exist"]}, status: :unprocessable_entity
			return false
		elsif (!@room)
			render json: {"room" => ["does not exist"]}, status: :unprocessable_entity
			return false
		elsif (!@room.users.exists?(params[:id]))
			render json: {"user" => ["is not in this room"]}, status: :unprocessable_entity
			return false
		end
		return true
	end


	def load_entities
		@room = Room.find_by_id(params[:room_id]);
		@muted_user = User.find_by_id(params[:id]);
	end

  end
