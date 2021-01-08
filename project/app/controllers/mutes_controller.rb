class MutesController < ApplicationController
	before_action :authenticate_user!
	before_action :load_entities

	def mute
		unless correct_req
			if (!@current_user.is_room_owner?(@room))
				render json: {"you" => ["must be owner of this room"]}, status: :unprocessable_entity
			elsif (@room.mutes.exist?(muted_user_id: params[:id]))
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
		unless correct_req
			if (!@current_user.is_room_owner?(@room))
				render json: {"you" => ["must be owner of this room"]}, status: :unprocessable_entity
			elsif !(@mute = @room.mutes.where(muted_user_id: params[:id]).take)
				render json: {"User" => ["is not muted"]}, status: :unprocessable_entity
			else
				UnmuteRoomUserJob.perform_now(@mute)
				@muted_user
			end
		end
	end

	private

	def correct_req
		if (!@muted_user)
			render json: {"user" => ["does not exist"]}, status: :unprocessable_entity
			false
		elsif (!@room)
			render json: {"room" => ["does not exist"]}, status: :unprocessable_entity
			false
		elsif (!@room.users.exists?(params[:id]))
			render json: {"user" => ["is not in this room"]}, status: :unprocessable_entity
			false
		end
		true
	end


	def load_entities
		@room = Room.find_by_id(params[:room_id]);
		@muted_user = User.find_by_id(params[:id]);
	end

  end
