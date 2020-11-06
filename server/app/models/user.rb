class User < ApplicationRecord
	validates :name, presence: true
	validates :name, length: {minimum: 3, maximum: 32}
  	validates :login, presence: true, uniqueness: true
end
