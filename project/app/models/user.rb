class User < ApplicationRecord
  rolify
  after_create :assign_default_role
	has_one_attached :avatar
	has_many :notifications, foreign_key: :recipient_id

	has_one :guild_user,  -> (object) { where(status: :confirmed) }, dependent: :destroy
	has_one :guild, through: :guild_user

	has_one :guild_user_pending,  -> (object) { where(status: :pending) }, class_name: "GuildUser", dependent: :destroy
	has_one :pending_guild, through: :guild_user_pending, source: :guild
	has_and_belongs_to_many :rooms

	has_many :game_users
	has_many :games, through: :game_users

	has_many :blocks
	has_many :blocked_users, :through => :blocks

	has_many :friendships
	has_many :friends, :through => :friendships

	validates :avatar, blob: { content_type: :image, size_range: 1..5.megabytes }
	validates :name, presence: true
	validates :name, length: {minimum: 3, maximum: 32}, uniqueness: true
	validates :login, presence: true, uniqueness: true
	validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
	validates :two_fact_auth, inclusion: { in: [ true, false ] }

	after_create :attach_avatar

	def attach_avatar
		self.avatar.attach(
			io: File.open("default/user.jpg", "r"),
			filename: "user.jpg",
			"content_type": "image/jpeg",
		)
	end

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

	def room_role(room)
		if self.is_room_owner?(room)
			return "Owner"
		elsif self.is_room_administrator?(room)
			return "Administrator"
		else
			return "Member"
		end
	end

	def	is_room_owner?(room)
		self.has_role?(:owner, room)
	end

	def is_room_administrator?(room)
		self.has_role?(:administrator, room) || is_room_owner?(room)
	end

	def is_member?(room)
		!is_room_administrator?(room)
	end

	def is_room_mute?(room)
		room.mutes.exists?(muted_user_id: self.id)
	end

	def is_room_ban?(room)
		room.bans.exists?(banned_user_id: self.id)
	end

	def is_blocked?(user)
		if (user == self)
			return false;
		end
		return self.blocks.exists?(blocked_user_id: user.id);
	end

	def is_friend_of?(user)
		if (user == self)
			return false;
		end
		return self.friendships.exists?(friend_id: user.id);
	end

	def pending_guild?
		if self.pending_guild
			return true
		else
			return nil
		end
	end

	def is_playing_in?(game)
		return self.has_role?(:player, game) || self.has_role?(:host, game);
	end

	def is_spectating?(game)
		return self.has_role?(:spectator, game);
	end

	def appear(appearing_on)
		self.update_attributes(is_present: true, appearing_on: appearing_on);

		ActionCable.server.broadcast("appearance_channel", event: "appear", user_id: self.id, appearing_on: appearing_on);
	end

	def disappear
		self.update_attributes(is_present: false, appearing_on: "offline");

		ActionCable.server.broadcast("appearance_channel", event: "disappear", user_id: self.id);
	end

	def pendingGame
		games.where(status: [:pending]).first
	end

	def inGame?
		self.games.started.present? || self.games.pending.present?
	end

	def is_host?(game)
		self.has_role?(:host, game);
	end

	def send_notification(message, link, type)
		@notification = Notification.create(recipient: self, message: message, link: link, notification_type: type)
		ActionCable.server.broadcast("user_#{self.id}", @notification);
	end

	def game_points(game)
		self.game_users.where(game_id: game.id).first.points
	end
end
