import Backbone from "backbone";
import Mustache from "mustache";
import Games from "src/collections/Games";
import Game from "src/models/Game";
import BaseView from "src/lib/BaseView";
import moment from "moment";
import { displaySuccess } from "src/utils";
import { currentUser } from "src/models/Profile";

type Options = Backbone.ViewOptions & { model: Game, nb: number };

export default class MatchView extends BaseView {
  model: Game;
  nb: number;

  constructor(options?: Options) {
    super(options);

	this.model = options.model;
	this.nb = options.nb;

	/*$(`#game-${this.nb}`).click(function(){
		this.onPlayClicked();
	}, this);*/
  }

  /*async onPlayClicked() {
    console.log("test");
  }*/

  render() {

	const game = {
		...this.model.toJSON(),
		finished: this.model.get("status") === "finished",
	};

    const template = $(`#matchTemplate`).html();
    const html = Mustache.render(template, game);
	this.$el.html(html);
	
	if (this.model.get("status") === "pending") {
		this.model.get("players").forEach(function(item) {

			if (currentUser().get("id") == item.get("id")) {
				$(`#game-${this.nb}`).addClass("play");
				$(`#game-to-play`).show();
			}
		}, this);
	}

    return this;
  }
}