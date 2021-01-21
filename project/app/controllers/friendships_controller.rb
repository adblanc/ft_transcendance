class FriendshipsController < ApplicationController
	before_action :authenticate_user!

	def add
		@other_user = User.find_by_id(params[:id])
		return head :unauthorized if @current_user.is_friend_of?(@other_user)

		FriendRequest.create(requestor: @current_user, receiver: @other_user)
		@other_user.send_notification("#{@current_user.name} sent you a friend request", "/profile/#{@other_user.id}", "friend_request")
		@other_user
	end

	def accept
		@user = User.find_by_id(params[:id])
		@request = FriendRequest.where(requestor: @user, receiver: @current_user)
		@request.destroy
		@current_user.friends.push(@user)
		@user.send_notification("#{@current_user.name} accepted your friend request", "/profile/#{@user.id}", "friend_request")
	end

	def refuse
		@user = User.find_by_id(params[:id])
		@request = FriendRequest.where(requestor: @user, receiver: @current_user)
		@request.destroy
		@user.send_notification("#{@current_user.name} refused friend request", "/profile/#{@user.id}", "friend_request")
	end

	def remove
		@user = User.find_by_id(params[:id])
		@current_user.friends.delete(@user)
	end

  end
