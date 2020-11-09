class User < ApplicationRecord
	has_one_attached :avatar

	validates :avatar, blob: { content_type: :image, size_range: 1..5.megabytes }
	validates :name, presence: true
	validates :name, length: {minimum: 3, maximum: 32}
  	validates :login, presence: true, uniqueness: true
end
