import Mustache from "mustache";
import Backbone from "backbone";
import Game from "src/models/Game";
import BaseView from "src/lib/BaseView";
import WaitingGameView from "./WaitingGameView";
import StartGameView from "./StartGameView";
import { displaySuccess } from "src/utils/toast";
import { currentUser } from "src/models/Profile";

export default class GameIndexView extends BaseView {
  constructor(options?: Backbone.ViewOptions) {
	super(options);

	this.listenTo(currentUser(), "change", this.render);
  }

  render() {
    const template = $("#gameIndexTemplate").html();
    const html = Mustache.render(template, {});
	this.$el.html(html);
	
	if (currentUser().get("pendingGame")) { 
		const waitingGameView = new WaitingGameView();
		this.renderNested(waitingGameView, "#game-index-container");
	}
	else {
		const startGameView = new StartGameView();
		this.renderNested(startGameView, "#game-index-container");
	}

    return this;
  }

}
