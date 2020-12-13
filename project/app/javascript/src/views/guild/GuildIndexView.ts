import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "src/lib/BaseView";
import Guilds from "src/collections/Guilds";
import ItemView from "./ItemView";
import MyGuildView from "./MyGuildView";
import Profile from "src/models/Profile";
import Guild from "src/models/Guild";

export default class GuildIndexView extends BaseView {
  collection: Guilds;
  profile: Profile;
  myGuildView: Backbone.View;
  max: number;
  count: number;

  constructor(options?: Backbone.ViewOptions) {
    super(options);

	this.max = 5;
    this.collection = new Guilds({});
	this.profile = new Profile();
	
    this.myGuildView = new MyGuildView({
      profile: this.profile,
      collection: this.collection,
	});

    this.listenTo(this.profile, "change", this.render);
    this.profile.fetch();

    this.listenTo(this.collection, "reset", this.render);
    this.listenTo(this.collection, "change", this.render);
    this.listenTo(this.collection, "sort", this.render);
    this.listenTo(this.collection, "update", this.render);
    this.collection.fetch();
    this.collection.sort();
  }

  events() {
    return {
	  'click #load-more': 'onLoadMore'
    };
  }

  renderGuild(guild: Guild) {
	var itemView = new ItemView({
		model: guild,
	  });
	  this.$("#listing").append(itemView.render().el);
  }

  onLoadMore() {
	  var guilds = this.collection.models.slice(this.count, this.count + this.max);
	  if(guilds.length) {
			guilds.forEach(function (item) {
				this.renderGuild(item);
			}, this);
		  	this.count += guilds.length;
	  } 
	  if (this.count == this.collection.length) {
		  this.$("#load-more").hide();
	  }
  }

  render() {
    const template = $("#guildIndexTemplate").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

	var guilds = this.collection.first(this.max);
	guilds.forEach(function (item) {
		this.renderGuild(item);
	}, this);
	this.count = guilds.length;

    if (this.myGuildView) {
      this.renderNested(this.myGuildView, "#myguild");
    }

    return this;
  }
}
