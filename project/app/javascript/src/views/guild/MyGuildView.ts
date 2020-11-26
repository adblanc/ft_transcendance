import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import CreateGuildView from "./CreateGuildView";
import Guild from "src/models/Guild";
import Guilds from "src/collections/Guilds";
import Profile from "src/models/Profile";

type Options = Backbone.ViewOptions & { profile: Profile, collection: Backbone.Collection<Guild> };

export default class MyGuildView extends BaseView {
  profile: Profile;
  collection: Guilds;

  constructor(options?: Options) {
    super(options);

	this.profile = options.profile;
	this.collection = options.collection;

	this.listenTo(this.profile, "change", this.render);
	//this.model.fetch();

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
	if (this.profile.get('guild')) {
		const template = $("#withGuildTemplate").html();
		const html = Mustache.render(template, this.profile.toJSON());
		this.$el.html(html);
	}
	else {
		const template = $("#noGuildTemplate").html();
		const html = Mustache.render(template, this.profile.toJSON());
		this.$el.html(html);
	}

    return this;
  }
}