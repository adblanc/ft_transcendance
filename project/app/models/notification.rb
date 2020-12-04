class Notification < ApplicationRecord
	belongs_to :recipient, class_name: "User"
	belongs_to :actor, class_name: "User"
	belongs_to :notifiable, polymorphic: true 

	def as_json(options)
		super(options).merge(actor: actor, notifiable: notifiable)
	end

	scope :unread, ->{ where(read_at: nil) }
end
