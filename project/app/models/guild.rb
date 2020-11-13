class Guild < ApplicationRecord
	validates :name, presence: true, uniqueness: true
	validates :ang, presence: true, length: {minimum: 2, maximum: 5}
end
