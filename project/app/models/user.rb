class User < ApplicationRecord
  rolify
  after_create :assign_default_role
	has_one_attached :avatar
	belongs_to :guild, optional: true
	has_many :notifications, foreign_key: :recipient_id
	/means that user is referenced as foreign key in the notifications table/
	has_and_belongs_to_many :rooms

	validates :avatar, blob: { content_type: :image, size_range: 1..5.megabytes }
	validates :name, presence: true
	validates :name, length: {minimum: 3, maximum: 32}
	  validates :login, presence: true, uniqueness: true

	def assign_default_role
		/global role - could be switched to admin/
		self.add_role(:regular)
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
			return "Owner"
		when self.guild_officer?(guild)
			return "Officer"
		when self.guild.present?
			return "Member"
		else
			return nil
		end
	end

	def admin?
		self.has_role?(:admin)
	end

	def send_notification(actor, action, notifiable)
		self.notifications.push(Notification.create!(actor: actor, action: action, notifiable: notifiable))
		SendNotificationJob.perform_later(self, actor, actor, notifiable)
	end
end
