import Mustache from "mustache";
import Backbone from "backbone";
import BaseView from "src/lib/BaseView";
import WaitingGameView from "./WaitingGameView";
import StartGameView from "./StartGameView";
import { displaySuccess } from "src/utils/toast";
import { currentUser } from "src/models/Profile";
import { eventBus } from "src/events/EventBus";

export default class GameIndexView extends BaseView {
  constructor(options?: Backbone.ViewOptions) {
	super(options);

	this.listenTo(currentUser(), "change", this.render);
	this.listenTo(eventBus, "game:expire", this.relaunch);
  }

  relaunch() {
	currentUser().fetch({
		success: () => {
			this.render();
		}
	});
}

  render() {
    const template = $("#gameIndexTemplate").html();
    const html = Mustache.render(template, {});
	this.$el.html(html);
	
	if (currentUser().get("pendingGame") ) { 
		if (currentUser().get("pendingGame").get("game_type") != "chat") {
			const waitingGameView = new WaitingGameView({
				model: currentUser().get("pendingGame"),
			});
			this.renderNested(waitingGameView, "#game-index-container");
		}
		else {
			const startGameView = new StartGameView({disable:true});
			this.renderNested(startGameView, "#game-index-container");
		}
	}
	else {
		const startGameView = new StartGameView({disable:false});
		this.renderNested(startGameView, "#game-index-container");
	}

    return this;
  }

}
