class Room < ApplicationRecord
	resourcify

	after_destroy :notify_destruction_to_rooms_channel
	before_destroy :notify_destruction_to_users
	after_save		:notify_creation_to_rooms_channel

	has_secure_password :password, validations: false

	validates :name, presence: true, uniqueness: true, allow_blank: true, length: {minimum: 0, maximum: 16}
	validates :password, allow_blank: true, length: {minimum: 0}

	has_many :room_messages, dependent: :destroy,
						 inverse_of: :room
	has_and_belongs_to_many :users

	has_many :mutes
	has_many :muted_users, :through => :mutes

	has_many :bans
	has_many :banned_users, :through => :bans

	def notify_destruction_to_rooms_channel
		payload = {
			id: self.id,
		}
		ActionCable.server.broadcast("rooms_global", {"action" => "channel_deleted", "payload" => payload});
	end

	def notify_destruction_to_users
		self.users.each do |user|
			user.send_notification("Room #{self.name} has been deleted", "", "room_deleted")
		end
	end

	def notify_creation_to_rooms_channel
		if (!self.is_private && !self.is_dm)
			ActionCable.server.broadcast("rooms_global", {"action" => "channel_created", "payload" => nil});
		end
	end

	def valid_update_role_action(action)
		!action.blank? && (action === "promoted" || action === "demoted");
	end

	def update_user_role(user, action)
		case action
		when "promoted"
			if (user.is_member?(self))
				user.add_role :administrator, self
			end
		when "demoted"
			if (user.is_room_administrator?(self))
				user.remove_role :administrator, self
			end
		end
	end

	def remove_user(user)
		if (self.is_dm)
			self.destroy
			return "destroyed";
		else
			users.delete(user)
			if user.is_room_owner?(self)
				return remove_owner(user)
			elsif user.is_room_administrator?(self)
				user.remove_role(:administrator, self)
			end
		end

		return "left";
	end

	def remove_owner(user)
		user.remove_role(:owner, self)
		if users.blank?
			self.destroy
			return "destroyed"
		else
			new_owner = users.first
			new_owner.remove_role(:administrator, self) if new_owner.is_room_administrator?(self)
			new_owner.add_role(:owner, self)
		end
		return "left";
	end

	def send_room_notification(type, issuer, target, time)

		room_content = room_notification_content(type,issuer, target,time);

		if (room_content)
			room_msg = RoomMessage.create(user: issuer, room: self, content: room_content, is_notification: true);
			ActionCable.server.broadcast("room_#{self.id}", room_msg);
		end

		target_content = target_notification_content(type, issuer, time);

		if (target_content)
			target.send_notification(target_content, "", "room");
		end
	end

	def room_notification_content(type, issuer, target, time)
		case type
		when "ban"
			return "#{target.login_with_ang} has been banned #{time} by #{issuer.login_with_ang}"
		when "mute"
			return "#{target.login_with_ang} has been muted #{time} by #{issuer.login_with_ang}"
		when "unban"
			return "#{target.login_with_ang} has been unbanned by #{issuer.login_with_ang}"
		when "unmute"
			return "#{target.login_with_ang} has been unmuted by #{issuer.login_with_ang}"
		when "promoted"
			return "#{target.login_with_ang} has been promoted by #{issuer.login_with_ang}"
		when "demoted"
			return "#{target.login_with_ang} has been demoted by #{issuer.login_with_ang}"
		when "join"
			return "#{target.login_with_ang} has joined"
		when "left"
			return "#{target.login_with_ang} has left"
		else
			return nil;
		end
	end

	def target_notification_content(type, issuer, time)
		case type
		when "ban"
			return "you have been banned #{time} from #{self.name} by #{issuer.login_with_ang}"
		when "mute"
			return nil;
		when "unban"
			return "you have been unbanned from #{self.name} by #{issuer.login_with_ang}"
		when "unmute"
			return "you have been unmuted from #{self.name} by #{issuer.login_with_ang}"
		when "promoted"
			return "you have been promoted in #{self.name} by #{issuer.login_with_ang}"
		when "demoted"
			return "you have been demoted in #{self.name} by #{issuer.login_with_ang}"
		else
			return nil;
		end
	end

	def correct_mute_or_ban_time(time)
		case time
		when "10mn"
			return 10.minutes;
		when "30mn"
			return 30.minutes;
		when "1h"
			return 1.hours;
		when "24h"
			return 24.hours;
		when "indefinitely"
			return "indefinitely";
		else
			return false;
		end
	end

	def expected_mute_or_bantime
		return "Expected: 10mn | 30mn | 1h | 24h | indefinitely";
	end

	def correct_name(current_user)
		name = self.name;

		if (self.is_dm)
			other_user = self.users.where("id != ?", current_user.id).take;

			if (other_user)
				name = other_user.name;
			end

		end

		name ? name : self.name;
	end

end
