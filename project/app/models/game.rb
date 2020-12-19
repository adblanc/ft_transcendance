class Game < ApplicationRecord
    #resourcify
    validates :users, length: {minimum: 0}
    #has_and_belongs_to_many :users
    validates :level,  presence: true
        #accepts_nested_attributes_for :user
    validates :status, length: {minimum: 1} 
    validates :points, presence: true, length: {minimum: 1, maximum: 10}
end
