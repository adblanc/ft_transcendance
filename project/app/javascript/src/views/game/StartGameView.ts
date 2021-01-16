import Mustache from "mustache";
import Backbone from "backbone";
import Game from "src/models/Game";
import BaseView from "src/lib/BaseView";
import CreateGameView from "./CreateGameView";

export default class StartGameView extends BaseView {
  constructor(options?: Backbone.ViewOptions) {
	super(options);
  }
  
  events() {
	return {
	  "click #friendly-btn": () => this.startGame("friendly"),
	  "click #ladder-btn": () => this.startGame("ladder"),
	  "click #tournament-btn": () => this.startGame("tournament"),
	};
  }

   startGame(type: string) {
	   const game = new Game();
	   const createGameView = new CreateGameView({
			model: game,
			type: type,
	  });
  
	  createGameView.render();
   }

  render() {
    const template = $("#gameStartTemplate").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);
    return this;
  }

}
