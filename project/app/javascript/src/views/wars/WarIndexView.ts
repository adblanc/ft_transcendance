import Backbone from "backbone";
import Mustache from "mustache";
import Guild from "src/models/Guild";
import BaseView from "src/lib/BaseView";
import Profile from "src/models/Profile";
import Wars from "src/collections/Wars";
import War from "src/models/War";
import WarBoardView from "./WarBoardView";
import MyWarView from "./MyWarView";

export default class WarIndexView extends BaseView {
	profile: Profile;
	wars: Wars;
	warBoardView: WarBoardView;
	myWar: War;
	myWarView: MyWarView;

  constructor(options?: Backbone.ViewOptions) {
	super(options);
	
	this.profile = new Profile();
	this.profile.fetch();
	this.wars = new Wars();
	this.wars.fetch();
	
	this.warBoardView = new WarBoardView({
		collection: this.wars,
	});

	this.myWarView = new MyWarView({
		war: this.myWar,
	})

  }

  render() {
    const template = $("#warIndexTemplate").html();
    const html = Mustache.render(template, {});
	this.$el.html(html);
	
	this.renderNested(this.warBoardView, "#board");
	this.renderNested(this.myWarView, "#mywar");

    return this;
  }
}
