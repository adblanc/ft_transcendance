import Backbone from "backbone";
import Mustache from "mustache";
import Guild from "src/models/Guild";
import BaseView from "src/lib/BaseView";
import { currentUser } from "src/models/Profile";
import Wars from "src/collections/Wars";
import War from "src/models/War";
import WarBoardView from "./WarBoardView";
import MyWarView from "./MyWarView";

export default class WarIndexView extends BaseView {
	wars: Wars;
	warBoardView: WarBoardView;
	myWarView: MyWarView;

  constructor(options?: Backbone.ViewOptions) {
	super(options);

	this.wars = new Wars();
	this.wars.fetch();

	this.listenTo(this.wars, "update", this.render);
	this.listenTo(currentUser(), "change", this.render);

  }

  render() {
    const template = $("#warIndexTemplate").html();
    const html = Mustache.render(template, {});
	this.$el.html(html);

	this.warBoardView = new WarBoardView({
		collection: this.wars,
	});
	this.renderNested(this.warBoardView, "#board");

	if (currentUser().get("guild")) {
		this.myWarView = new MyWarView({
			guild: currentUser().get("guild")
		})
		this.renderNested(this.myWarView, "#mywar");
	}

    return this;
  }
}
