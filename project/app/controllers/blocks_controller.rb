class BlocksController < ApplicationController
	before_action :authenticate_user!

	def update
		if (@current_user.blocks.where(blocked_user_id: params[:id]).take)
			render json: {"User" => ["is already blocked"]}, status: :unprocessable_entity
		else
			@blocked = @current_user.blocks.build(:blocked_user_id => params[:id])
			if @blocked.save
				@current_user
			else
				render json: @blocked.errors, status: :unprocessable_entity
			end
		end
	end

	def destroy

	end

  end
