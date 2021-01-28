import Mustache from "mustache";
import Backbone from "backbone";
import BaseView from "src/lib/BaseView";
import LadderOpponentView from "./LadderOpponentView";
import { currentUser } from "src/models/Profile";
import RankedUsers from "src/collections/RankedUsers";

export default class LadderView extends BaseView {
	opponents: RankedUsers;

  constructor(options?: Backbone.ViewOptions) {
	super(options);

	this.opponents = new RankedUsers();
	this.opponents.fetch();
	this.opponents.sort();
	
	this.listenTo(this.opponents, "update", this.render);
	this.listenTo(this.opponents, "sort", this.render);
  }

  render() {
    const template = $("#ladderTemplate").html();
    const html = Mustache.render(template, {});
	this.$el.html(html);

	const $element = this.$("#list");

	this.opponents.forEach(function (item) {
			var opponentView = new LadderOpponentView({
			model: item,
			challengeable: item.get("ladder_rank") < currentUser().get("ladder_rank")
			});
			$element.append(opponentView.render().el);
	});

    return this;
  }

}
