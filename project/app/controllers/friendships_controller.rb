class FriendshipsController < ApplicationController
	before_action :authenticate_user!

	def create
		if (@current_user.blocks.exists?(friend_id: params[:id]))
			render json: {"User" => ["is already your friend"]}, status: :unprocessable_entity
		else
			@friend = @current_user.friends.build(:friend_id => params[:id])
			if @friend.save
				@current_user
			else
				render json: @friend.errors, status: :unprocessable_entity
			end
		end
	end

	def destroy
		@friend = @current_user.friends.where(friend_id: params[:id]).take;
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
