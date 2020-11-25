import Backbone from "backbone";
import Mustache from "mustache";
import Guild from "src/models/Guild";
import CreateGuildView from "./CreateGuildView";
import PageView from "src/lib/PageView";
import Guilds from "src/collections/Guilds";
import ItemView from "./ItemView";
import MyGuildView from "./MyGuildView";

export default class GuildIndexView extends PageView {
//	profile: Backbone.AssociatedModel;
  collection: Backbone.Collection<Guild>;
  myGuildView: Backbone.View;

  constructor(options?: Backbone.ViewOptions) {
	super(options);
	
	this.collection = new Guilds({});
	this.listenTo(this.collection, 'reset', this.render);
	this.listenTo(this.collection, "change", this.render);
	this.listenTo(this.collection, "sort", this.render);
	this.collection.fetch();
	this.collection.sort();

	this.myGuildView = new MyGuildView();
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
	
	const $element = this.$("#listing");

    this.collection.forEach(function (item) {
      var itemView = new ItemView({
        model: item,
      });
      $element.append(itemView.render().el);
	});
	
	console.log(this.myGuildView);

	if (this.myGuildView) {
		this.renderNested(this.myGuildView, "#myguild");
	}

    return this;
  }
}
