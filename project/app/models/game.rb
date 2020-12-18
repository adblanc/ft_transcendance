class Game < ApplicationRecord
    #resourcify
    #has_many :user
    validates :id, presence: true
    #has_many :points
    validates :level,  presence: true
        #accepts_nested_attributes_for :user

    validates :points, presence: true, length: {minimum: 1, maximum: 10}
end
