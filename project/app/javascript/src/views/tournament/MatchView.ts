import Backbone from "backbone";
import Mustache from "mustache";
import Games from "src/collections/Games";
import Game from "src/models/Game";
import BaseView from "src/lib/BaseView";
import moment from "moment";
import { displaySuccess } from "src/utils";
import { currentUser } from "src/models/Profile";

type Options = Backbone.ViewOptions & { model: Game };

export default class MatchView extends BaseView {
  model: Game;

  constructor(options?: Options) {
    super(options);

	this.model = options.model;

  }

  render() {

	const game = {
		...this.model.toJSON(),
		finished: this.model.get("status") === "finished",
	};

    const template = $(`#matchTemplate`).html();
    const html = Mustache.render(template, game);
	this.$el.html(html);
	
	

    return this;
  }
}