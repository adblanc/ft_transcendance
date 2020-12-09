import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import Profile from "src/models/Profile";
import Guild from "src/models/Guild";
import { displaySuccess } from "src/utils";

type Options = Backbone.ViewOptions & { model: Profile; guild: Guild };

export default class PendingMemberView extends BaseView {
  model: Profile;
  guild: Guild;

  constructor(options?: Options) {
    super(options);

    this.model = options.model;
    this.guild = options.guild;

    this.listenTo(this.model, "change", this.render);
    this.listenTo(this.model, "add", this.render);
    this.listenTo(this.guild, "add", this.render);
    this.listenTo(this.guild, "delete", this.render);
  }

  events() {
    return {
      "click #accept-btn": "onAcceptClicked",
      "click #refuse-btn": "onRefuseClicked",
    };
  }

  async onAcceptClicked() {
    const success = await this.guild.accept(this.model.get("id"));

    if (success) {
      this.saved("accepted");
    }
  }

  async onRefuseClicked() {
    const success = await this.guild.reject(this.model.get("id"));

    if (success) {
      this.saved("refused");
    }
  }

  saved(method: "accepted" | "refused") {
    switch (method) {
      case "accepted":
        displaySuccess(
          `You accepted ${this.model.get("name")} into your guild`
        );
        break;
      case "refused":
        displaySuccess(
          `You refused ${this.model.get("name")}'s request to join your guild`
        );
        break;
    }
    this.guild.fetch();
  }

  render() {
    const template = $("#pendingMemberTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
    this.$el.html(html);

    return this;
  }
}
