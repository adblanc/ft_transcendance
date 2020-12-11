import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import CreateGuildView from "./CreateGuildView";
import Guild from "src/models/Guild";
import Guilds from "src/collections/Guilds";
import Profile from "src/models/Profile";
import { displaySuccess } from "src/utils";

type Options = Backbone.ViewOptions & { profile: Profile; collection: Guilds };

export default class MyGuildView extends BaseView {
  profile: Profile;
  collection: Guilds;

  constructor(options?: Options) {
    super(options);

    this.profile = options.profile;
    this.collection = options.collection;

    this.listenTo(this.profile, "change", this.render);
    //this.profile.fetch();
  }

  events() {
    return {
      "click #create-btn": "onCreateClicked",
      "click #withdraw-btn": "onWithdrawClicked",
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

  async onWithdrawClicked() {
    const success = await this.profile.get("pending_guild").withdraw();

    if (success) {
      this.guildWithdraw();
    }
  }

  guildWithdraw() {
    displaySuccess(
      `You have withdrawn your request to join ${this.profile
        .get("pending_guild")
        .get("name")}.`
    );
    this.profile.fetch();
  }

  render() {
    if (this.profile.get("guild")) {
      const template = $("#withGuildTemplate").html();
      const html = Mustache.render(template, this.profile.toJSON());
      this.$el.html(html);
    } else if (this.profile.get("pending_guild")) {
      const template = $("#withPendingGuildTemplate").html();
      const html = Mustache.render(template, this.profile.toJSON());
      this.$el.html(html);
    } else {
      const template = $("#noGuildTemplate").html();
      const html = Mustache.render(template, this.profile.toJSON());
      this.$el.html(html);
    }

    return this;
  }
}
