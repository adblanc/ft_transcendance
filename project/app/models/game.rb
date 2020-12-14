class Game < ApplicationRecord
    resourcify
        has_many :user
        has_one_attached :points
        has_one_attached :level
        #accepts_nested_attributes_for :user

        validates :points, presence: true, length: {minimum: 1, maximum: 10}
end
