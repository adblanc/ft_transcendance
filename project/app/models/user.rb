class User < ApplicationRecord
  rolify
  after_create :assign_default_role
	has_one_attached :avatar
	belongs_to :guild, optional: true

	validates :avatar, blob: { content_type: :image, size_range: 1..5.megabytes }
	validates :name, presence: true
	validates :name, length: {minimum: 3, maximum: 32}
	  validates :login, presence: true, uniqueness: true
	  
	def assign_default_role
		/global role - could be switched to admin/
		self.add_role(:regular) if self.roles.blank?
		/role within guild need to be set here?/
	end

	def guild_owner?(guild)
		self.has_role?(:owner, guild)
	end

	def guild_officer?(guild)
		self.has_role?(:officer, guild)
	end

	def guild_role?
		case true
		when self.guild_owner?(guild)
			return "owner"
		when self.guild_officer?(guild)
			return "officer"
		when self.guild.present?
			return "member"
		else
			return nil
		end
	end

	def admin?
		self.has_role?(:admin)
	end
end
