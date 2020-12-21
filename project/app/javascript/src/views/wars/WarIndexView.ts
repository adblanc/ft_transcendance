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
	myWarView: MyWarView;

  constructor(options?: Backbone.ViewOptions) {
	super(options);
	
	this.profile = new Profile();
	this.profile.fetch({
		success: () => {
			var id = this.profile.get("guild").get("id");
			var guild = new Guild({id});
			guild.fetch({
				success: () => {
					this.myWarView = new MyWarView({
						guild: guild,
						profile: this.profile,
					})
					this.renderNested(this.myWarView, "#mywar");
				}
			});
		}
	});
	this.wars = new Wars();
	this.wars.fetch({
		success: () => {
			this.warBoardView = new WarBoardView({
				collection: this.wars,
			});
			this.renderNested(this.warBoardView, "#board");
		}
	});

  }

  render() {
    const template = $("#warIndexTemplate").html();
    const html = Mustache.render(template, {});
	this.$el.html(html);

    return this;
  }
}
