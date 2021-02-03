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
    const template = $(`#matchTemplate`).html();
    const html = Mustache.render(template, this.model.toJSON());
	this.$el.html(html);
	
	//if user is winner, add class winner
	//to display score : add score class - comment je track si un jeu est gagné?

	//besoin d'une round view
	//J'ai les 4 jeux, j'itere dessus, et si empty

    return this;
  }
}