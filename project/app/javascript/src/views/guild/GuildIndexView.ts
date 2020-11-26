import Backbone from "backbone";
import Mustache from "mustache";
import Guild from "src/models/Guild";
import PageView from "src/lib/PageView";
import Guilds from "src/collections/Guilds";
import ItemView from "./ItemView";
import MyGuildView from "./MyGuildView";
import Profile from "src/models/Profile";

export default class GuildIndexView extends PageView {
  collection: Guilds;
  profile: Profile;
  myGuildView: Backbone.View;

  constructor(options?: Backbone.ViewOptions) {
	super(options);
	
	this.collection = new Guilds({});

	this.profile = new Profile();
	this.myGuildView = new MyGuildView({
		profile: this.profile,
		collection: this.collection,
	});
	this.listenTo(this.profile, "change", this.render);
	this.profile.fetch();

	this.listenTo(this.collection, 'reset', this.render);
	this.listenTo(this.collection, "change", this.render);
	this.listenTo(this.collection, "sort", this.render);
	this.listenTo(this.collection, "delete", this.render);
	this.collection.fetch();
	this.collection.sort();
  }

  render() {
    const template = $("#guildIndexTemplate").html();
    const html = Mustache.render(template, {});
	this.$el.html(html);
	
	const $element = this.$("#listing");

    this.collection.forEach(function (item) {
      var itemView = new ItemView({
        model: item,
      });
      $element.append(itemView.render().el);
	});

	if (this.myGuildView) {
		this.renderNested(this.myGuildView, "#myguild");
	}

    return this;
  }
}
