import Backbone from "backbone";
import Mustache from "mustache";
import ModalView from "../ModalView";
import OpponentView from "./OpponentView";
import { displaySuccess } from "src/utils/toast";
import Game from "src/models/Game";
import { currentUser } from "src/models/Profile";
import RankedUsers from "src/collections/RankedUsers";
import { eventBus } from "src/events/EventBus";

export default class CreateLadderGameView extends ModalView<Game> {
	opponents: RankedUsers;

  constructor(options?: Backbone.ViewOptions<Game>) {
	super(options);
	
	this.opponents = new RankedUsers();
	this.opponents.fetch();
	
	this.listenTo(eventBus, "close:modal", this.closeModal);

  }

  render() {
    super.render();
    const template = $("#ladderGameTemplate").html();
    const html = Mustache.render(template, currentUser().toJSON());
	this.$content.html(html);
	
	const $element = this.$("#listing");

	console.log(this.opponents);

	this.opponents.forEach(function (item) {
		if (item.get("ladder_rank") > currentUser().get("ladder_rank")) {
			var opponentView = new OpponentView({
			model: item,
			game: this.model,
			});
			$element.append(opponentView.render().el);
		}
	});

    return this;
  }
}
