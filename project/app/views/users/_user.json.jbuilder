json.extract! user, :id, :login, :email, :two_fact_auth, :name, :contribution, :appearing_on, :created_at, :updated_at
json.is_present user == @current_user ? true : user.is_present
json.is_friend	user.is_friend_of?(@current_user)
json.avatar_url url_for(user.avatar) if user.avatar.attached?
json.guild_role user.guild_role?
json.admin user.admin?
if user.guild_role?
	json.guild do
		json.id user.guild.id
		json.name user.guild.name
		json.points user.guild.points
		json.img_url url_for(user.guild.img) if user.guild.img.attached?
		json.atWar user.guild.atWar?
		json.warInitiator user.guild.warInitiator?
	end
else
	json.guild nil
end
if user.pending_guild?
  json.pending_guild do
		json.id user.pending_guild.id
		json.name user.pending_guild.name
		json.points user.pending_guild.points
		json.img_url url_for(user.pending_guild.img) if user.pending_guild.img.attached?
	end
else
	json.pending_guild nil
end

json.friends do
	json.array! user.friends do |friend|
		json.partial! "users/userSnippet", user: friend
	end
end
json.pendingGame user.pendingGame

json.blocked_users do
	json.array! user.blocked_users do |blocked_user|
		json.partial! "users/userSnippet", user: blocked_user
	end
end

