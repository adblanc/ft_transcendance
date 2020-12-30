class MutesController < ApplicationController
	before_action :authenticate_user!

	def update
		if (@current_user.mutes.where(muted_user_id: params[:id]))
			render json: {"User" => ["is already muted"]}, status: :unprocessable_entity
		else
			@mute = @current_user.mutes.build(:muted_user_id => params[:id])
			if @mute.save
				@current_user
			else
				render json: @mute.errors, status: :unprocessable_entity
			end
		end
	end

	def destroy

	end

  end
