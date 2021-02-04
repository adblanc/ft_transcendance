import Backbone from "backbone";
import Mustache from "mustache";
import Games from "src/collections/Games";
import Game from "src/models/Game";
import BaseView from "src/lib/BaseView";
import moment from "moment";
import { displaySuccess } from "src/utils";
import { currentUser } from "src/models/Profile";
import MatchView from "./MatchView";

type Options = Backbone.ViewOptions & { collection: Games, round: string};

export default class RoundView extends BaseView {
  collection: Games;
  round: string;

  constructor(options?: Options) {
    super(options);

	this.collection = options.collection;
	this.round = options.round;

  }

  render() {
    const template = $(`#round${this.round}Template`).html();
    const html = Mustache.render(template, {});
	this.$el.html(html);
	
	var nb = 1; 
	this.collection.forEach(function (item) {
		var matchView = new MatchView({
			model: item,
			nb: nb,
		});
		this.$(`#game-${nb}`).append(matchView.render().el);
		nb++;
	}, this);

    return this;
  }
}
