json.extract! member, :id, :name, :contribution, :is_present

json.avatar_url url_for(member.avatar) if member.avatar.attached?
json.guild_role member.guild_role?
json.admin member.admin?

