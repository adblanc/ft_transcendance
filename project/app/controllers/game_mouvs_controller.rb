class GameMouvsController < ApplicationController
    before_action :load_entities
    def create
         @game_mouv = GameMouv.create(game_mouvs_params)
    #    # return head :not_found
         ActionCable.server.broadcast("game_#{params[:game_id]}", game_mouvs_params);
     end

    protected
    def load_entities
        @game = Game.find(params[:game_id])
    end
    private
    def game_mouvs_params
        params.permit(:user_id, :game_id, :scale, :ball_x, :ball_y)
    end
end
