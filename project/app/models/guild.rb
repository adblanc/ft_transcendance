class Guild < ApplicationRecord
	validates :name, presence: true, uniqueness: true, length: {minimum: 3, maximum: 20}
	validates :ang, presence: true, length: {minimum: 2, maximum: 5}
end
