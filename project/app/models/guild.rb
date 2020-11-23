class Guild < ApplicationRecord
	has_one_attached :img
	has_many :users
	accepts_nested_attributes_for :users

	validates :img, blob: { content_type: :image }
	validates :name, presence: true, uniqueness: true, length: {minimum: 5, maximum: 20}
	validates :ang, presence: true, length: {minimum: 2, maximum: 5}
end
