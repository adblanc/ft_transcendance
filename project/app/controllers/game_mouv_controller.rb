class GameMouvController < ApplicationController
    before_action :load_entities
    def create
        #@game_mouv = GameMouv.create(user: current_user, game: @game, content :params[:scale])
        ActionCable.server.broadcast("game_#{params[:game_id]}", params[:scale]);
    end

    protected
    def load_entities
        @game = Game.find(params[:game_id])
        #return :not_found unless @game
    end
    # def mouv_params
    #     params.permit(:id, :game_id, :scale)
    # end
end
