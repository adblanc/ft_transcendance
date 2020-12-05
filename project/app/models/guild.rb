class Guild < ApplicationRecord
  resourcify
	has_one_attached :img

	has_many :confirmed_users,  -> (object) { where(status: :confirmed) }, class_name: "GuildUser", foreign_key: :guild_id, dependent: :destroy
	has_many :members, through: :confirmed_users, source: :user
	has_many :pending, -> (object) { where(status: :pending) }, class_name: "GuildUser", foreign_key: :guild_id, dependent: :destroy
	has_many :pending_members, through: :pending, source: :user

	validates :img, blob: { content_type: :image }
	validates :name, presence: true, uniqueness: true, length: {minimum: 5, maximum: 20}
	validates :ang, presence: true, length: {minimum: 2, maximum: 5}

	def remove_user(user)
		members.delete(user)
		user.update(contribution: 0)
		if user.guild_owner?(self)
			remove_owner(user)
			return
		elsif user.guild_officer?(self)
		  user.remove_role(:officer, self)
		end
	end

	def remove_owner(user)
		user.remove_role(:owner, self)
		if members.blank?
			self.destroy
		else
			new_owner = members.first
			new_owner.add_role(:owner, self)
			new_owner.remove_role(:officer, self) if new_owner.guild_officer?(self)
		end
	end

	def owner
		User.with_role(:owner, self).first
	end

	def officers
		User.with_role(:officer, self)
	end

	def notify_officers(user, action, notifiable)
		(self.officers.to_ary << self.owner).each do |officer|
			officer.send_notification(user, action, notifiable)
		end
	end

end
