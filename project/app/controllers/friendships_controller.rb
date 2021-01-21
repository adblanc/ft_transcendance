class FriendshipsController < ApplicationController
	before_action :authenticate_user!

	def add
		@other_user = User.find_by_id(params[:id])
		return head :unauthorized if @current_user.is_friend_of?(@other_user) || @other_user.has_requested_friend?(@current_user) || @other_user.has_received_friend?(@current_user)
		return head :unauthorized if @current_user == @other_user

		FriendRequest.create(requestor: @current_user, receiver: @other_user)
		@other_user.send_notification("#{@current_user.name} sent you a friend request", "/user/#{@other_user.id}", "friend_request")
		@other_user
	end

	def accept
		@other_user = User.find_by_id(params[:id])
		return head :unauthorized if @current_user.is_friend_of?(@other_user) || @current_user.has_requested_friend?(@other_user)
		return head :unauthorized if not @other_user.has_requested_friend?(@current_user)
		return head :unauthorized if @current_user == @other_user

		@request = FriendRequest.where(requestor: @other_user, receiver: @current_user).first
		@request.destroy
		Friendship.create(user: @current_user, friend: @other_user)
		@other_user.send_notification("#{@current_user.name} accepted your friend request", "/user/#{@other_user.id}", "friend_request")
		@other_user
	end

	def refuse
		@other_user = User.find_by_id(params[:id])
		return head :unauthorized if @current_user.is_friend_of?(@other_user) || @current_user.has_requested_friend?(@other_user)
		return head :unauthorized if not @other_user.has_requested_friend?(@current_user)
		return head :unauthorized if @current_user == @other_user

		@request = FriendRequest.where(requestor: @other_user, receiver: @current_user).first
		@request.destroy
		@other_user.send_notification("#{@current_user.name} refused your friend request", "/user/#{@other_user.id}", "friend_request")
		@other_user
	end

	def remove
		@other_user = User.find_by_id(params[:id])
		return head :unauthorized if not @current_user.is_friend_of?(@other_user) 
		return head :unauthorized if @current_user == @other_user

		@friendship = look_for_friendship(@current_user, @other_user)
		@friendship.destroy
		@other_user
	end

	private

	def look_for_friendship(user_a, user_b)
		if @friendship = Friendship.where(user: user_a, friend: user_b).first
			return @friendship
		else
			return Friendship.where(user: user_b, friend: user_a).first
		end
	end

  end
