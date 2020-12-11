class Game < ApplicationRecord
    resourcify
        has_many: users
        has_one_attached: Points
        accepts_nested_attributes_for :users

        validates : Points, presence: true, length: {minimum: 1, maximum: 10}
end
