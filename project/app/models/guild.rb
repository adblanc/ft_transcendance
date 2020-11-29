class Guild < ApplicationRecord
  resourcify
	has_one_attached :img
	has_many :users
	accepts_nested_attributes_for :users

	validates :img, blob: { content_type: :image }
	validates :name, presence: true, uniqueness: true, length: {minimum: 5, maximum: 20}
	validates :ang, presence: true, length: {minimum: 2, maximum: 5}

	def remove_user(user)
		users.delete(user)
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
		if users.blank?
			self.destroy
		else
			new_owner = users.first
			new_owner.add_role(:owner, self)
			new_owner.remove_role(:officer, self) if new_owner.guild_officer?(self)
		end
	end


end
