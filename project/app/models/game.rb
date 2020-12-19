class Game < ApplicationRecord
    #resourcify
    #validates :id, presence: true
    has_many :users, source: :user
    validates :level,  presence: true
        #accepts_nested_attributes_for :user
    validates :status, length: {minimum: 1} 
    validates :points, presence: true, length: {minimum: 1, maximum: 10}
end
