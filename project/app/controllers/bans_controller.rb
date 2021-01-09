class BansController < ApplicationController
	before_action :authenticate_user!
	before_action :load_entities

	def ban
		if (!correct_req)
			return ;
		end
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

	def unban
		if (!correct_req)
			return ;
		end
		if (!@current_user.is_room_owner?(@room))
			render json: {"you" => ["must be owner of this room"]}, status: :unprocessable_entity
		elsif !(@ban = @room.bans.where(banned_user_id: params[:id]).take)
			render json: {"User" => ["is not banned"]}, status: :unprocessable_entity
		else
			UnbanRoomUserJob.perform_now(@ban)
			@banned_user
		end
	end

	private

	def correct_req
		if (!@banned_user)
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
		@banned_user = User.find_by_id(params[:id]);
	end

  end
