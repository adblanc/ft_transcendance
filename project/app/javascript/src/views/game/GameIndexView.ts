import Mustache from "mustache";
import Backbone from "backbone";
import Game from "src/models/Game";
import Rectangle from "src/models/Rectangle";
import BaseView from "src/lib/BaseView";
import CreateGameView from "./CreateGameView";
import CanvaView from "./CanvaView";
import Player from "src/models/Player";
import { displaySuccess } from "src/utils/toast";

export default class GameIndexView extends BaseView {
  constructor(options?: Backbone.ViewOptions) {
	super(options);
  }
  
  events() {
	return {
	  "click #create_game": "startGame",
	};
  }

   startGame() {
	   const game = new Game();
	   const createGameView = new CreateGameView({
			model: game,
	  });
  
	  createGameView.render();
   }

  render() {
    const template = $("#index_game").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);
    return this;
  }

}
