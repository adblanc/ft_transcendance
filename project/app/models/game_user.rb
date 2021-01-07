class GameUser < ApplicationRecord
    belongs_to :game
    belongs_to :user

    def score(points)
        increment!(:points, points)
    end
end
