class FriendshipsController < ApplicationController
	before_action :authenticate_user!

	def add
		if (@current_user.friendships.where(friend_id: params[:id]).take)
			render json: {"User" => ["is already your friend"]}, status: :unprocessable_entity
		else
			@friend = @current_user.friendships.build(:friend_id => params[:id])
			if @friend.save
				@current_user
			else
				render json: @friend.errors, status: :unprocessable_entity
			end
		end
	end

	def remove
		@friend = @current_user.friendships.where(friend_id: params[:id]).take;
		if (@friend)
			if (@friend.destroy)
				@current_user
			else
				render json: @friend.errors, status: :unprocessable_entity
			end
		else
			render json: {"User" => ["is already not your friend"]}, status: :unprocessable_entity
		end
	end

  end
