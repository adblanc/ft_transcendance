import Backbone from "backbone";
import Mustache from "mustache";
import Guild from "src/models/Guild";
import CreateGuildView from "./CreateGuildView";
import PageView from "src/lib/PageView";
import Guilds from "src/collections/Guilds";

export default class GuildView extends PageView {
  collection: Backbone.Collection<Guild>;

  constructor(options?: Backbone.ViewOptions) {
	super(options);
	
	this.collection = new Guilds({});
	this.listenTo(this.collection, 'reset', this.render);
	this.listenTo(this.collection, "change", this.render);
	this.listenTo(this.collection, "sort", this.render);
	this.collection.fetch();
	this.collection.sort();
  }

  events() {
    return {
      "click #create-btn": "onCreateClicked",
    };
  }

  onCreateClicked() {
    const guild = new Guild();
    const createGuildView = new CreateGuildView({
	  model: guild,
	  collection: this.collection,
    });

    createGuildView.render();
  }

  render() {
    const template = $("#guildIndexTemplate").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

    return this;
  }
}
