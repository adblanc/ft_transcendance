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
	  "click #friendly-btn": "startFriendly",
	};
  }

   startFriendly() {
	   const game = new Game();
	   const createGameView = new CreateGameView({
			model: game,
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
