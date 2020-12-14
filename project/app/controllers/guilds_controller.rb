class GuildsController < ApplicationController
  def index
	@guilds = Guild.all
  end

  def show
	@guild = Guild.find(params[:id])
	return head :not_found unless @guild
  end

  def new
	guild = Guild.new
  end

  def create
	return head :unauthorized if current_user.guild.present? || current_user.guild_pending.present?

	@guild = Guild.create(guild_params)
	@guild.members.push(current_user)
	current_user.add_role :owner, @guild
	if @guild.save
		@guild
	else
		render json: @guild.errors, status: :unprocessable_entity
  	end
  end

  def edit
	@guild = Guild.find(params[:id])
	return head :unauthorized unless current_user.guild_owner?(@guild)
  end

  def update
	@guild = Guild.find(params[:id])
	return head :unauthorized unless current_user.guild_owner?(@guild)

	@guild.update(guild_params)
	if @guild.save
		@guild
	else
		render json: @guild.errors, status: :unprocessable_entity
  	end
  end

  def destroy
	@guild = Guild.find(params[:id])
	return head :unauthorized unless current_user.guild_owner?(@guild)

	@guild.members.each do |member|
		member.update(contribution: 0)
	end
	@guild.destroy
  end

  def quit
	@guild = Guild.find(params[:id])
	return head :unauthorized unless current_user.guild == @guild

	if @guild.remove_user(current_user)
		@guild
	end
  end

  def promote
	@guild = Guild.find_by(id: params[:id])
	return head :unauthorized unless current_user.guild_owner?(@guild) || current_user.admin? 

    user = User.find(params[:user_id])
	if user.add_role(:officer, @guild)
		@guild
	end
	user.send_notification(current_user, "promoted you to Officer for", @guild)
  end

  def demote
	@guild = Guild.find_by(id: params[:id])
	return head :unauthorized unless current_user.guild_owner?(@guild) || current_user.admin? 

    user = User.find(params[:user_id])
	if user.remove_role(:officer, @guild)
		@guild
	end
	user.send_notification(current_user, "demoted you to Member for", @guild)
  end

  def fire
	@guild = Guild.find_by(id: params[:id])
	return head :unauthorized unless current_user.guild_owner?(@guild) || current_user.admin? 

    user = User.find(params[:user_id])
	if @guild.remove_user(user)
		@guild
	end
	user.update(contribution: 0)
	user.send_notification(current_user, "fired you from", @guild)
  end

  def transfer
	@guild = Guild.find_by(id: params[:id])
	return head :unauthorized unless current_user.guild_owner?(@guild) || current_user.admin? 

	user = User.find(params[:user_id])
	owner = User.with_role(:owner, @guild).first
	user.add_role(:owner, @guild)
	owner.remove_role(:owner, @guild)
	if owner.add_role(:officer, @guild)
		@guild
	end
	user.send_notification(current_user, "transferred you ownership for", @guild)
  end

  def join
	@guild = Guild.find_by(id: params[:id])
	return head :unauthorized if current_user.guild.present? || current_user.pending_guild.present?

	@guild.pending_members.push(current_user)
	
	(@guild.officers.to_ary << @guild.owner).each do |officers|
		officers.send_notification(current_user, "wants to join", @guild)
	end
  end

  def accept
	@guild = Guild.find_by(id: params[:id])
	return head :unauthorized unless authorized_for_guild?(current_user, @guild) || current_user.admin?

	pending_member = User.find_by(id: params[:user_id])

    @guild.pending_members.delete(pending_member)
	@guild.members.push(pending_member)
	pending_member.send_notification(current_user, "accepted your request to join", @guild)
  end

  def reject
	@guild = Guild.find_by(id: params[:id])
	return head :unauthorized unless authorized_for_guild?(current_user, @guild) || current_user.admin?

    pending_member = User.find_by(id: params[:user_id])

    @guild.pending_members.delete(pending_member)
	pending_member.send_notification(current_user, "rejected your request to join", @guild)
  end

  def withdraw
	@guild = Guild.find_by(id: params[:id])
	return head :unauthorized unless current_user.pending_guild == @guild

	@guild.pending_members.delete(current_user)
  end

  private

  def authorized_for_guild?(user, guild)
    user.guild_owner?(guild) || user.guild_officer?(guild)
  end

  def guild_params
	params.permit(:name, :ang, :img)
  end
end