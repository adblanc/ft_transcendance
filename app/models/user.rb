class User < ApplicationRecord
	has_one_attached :avatar

	validates :avatar, blob: { content_type: :image }
	validates :name, presence: true
	validates :name, length: {minimum: 3, maximum: 32}
  	validates :login, presence: true, uniqueness: true
end
