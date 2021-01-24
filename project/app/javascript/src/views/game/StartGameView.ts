import Mustache from "mustache";
import Backbone from "backbone";
import Game from "src/models/Game";
import BaseView from "src/lib/BaseView";
import CreateGameView from "./CreateGameView";
import { currentUser } from "src/models/Profile";

type Options = Backbone.ViewOptions & { disable: boolean };

export default class StartGameView extends BaseView {
	disable: boolean;

  constructor(options?: Options) {
	super(options);

	this.disable = options.disable;
	this.listenTo(currentUser(), "change", this.render);
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
	
	if (this.disable == true) {
		this.$("#friendly-btn").addClass("btn-disabled");
		this.$("#ladder-btn").addClass("btn-disabled");
		this.$("#tournament-btn").addClass("btn-disabled");
		this.$("#chat-game").show();
	}
    return this;
  }

}
