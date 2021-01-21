class FriendshipsController < ApplicationController
	before_action :authenticate_user!

	def add
		@other_user = User.find_by_id(params[:id])
		return head :unauthorized if @current_user.is_friend_of?(@other_user)

		FriendRequest.create(requestor: @current_user, receiver: @other_user)
		@other_user.send_notification("#{@current_user.name} sent you a friend request", "/user/#{@other_user.id}", "friend_request")
		@other_user
	end

	def accept
		@other_user = User.find_by_id(params[:id])
		return head :unauthorized if @current_user.is_friend_of?(@other_user) || @other_user.has_requested_friend(@current_user) 

		@request = FriendRequest.where(requestor: @other_user, receiver: @current_user)
		@request.destroy
		@current_user.friends.push(@other_user)
		@user.send_notification("#{@current_user.name} accepted your friend request", "/user/#{@other_user.id}", "friend_request")
	end

	def refuse
		@other_user = User.find_by_id(params[:id])
		return head :unauthorized if @current_user.is_friend_of?(@other_user) || @other_user.has_requested_friend(@current_user) 

		@request = FriendRequest.where(requestor: @other_user, receiver: @current_user)
		@request.destroy
		@other_user.send_notification("#{@current_user.name} refused friend request", "/user/#{@other_user.id}", "friend_request")
	end

	def remove
		@other_user = User.find_by_id(params[:id])
		return head :unauthorized if not @current_user.is_friend_of?(@other_user) 

		@other_user = User.find_by_id(params[:id])
		@current_user.friends.delete(@other_user)
	end

  end
