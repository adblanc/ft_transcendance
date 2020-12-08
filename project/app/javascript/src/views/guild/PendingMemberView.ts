import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import Profile from "src/models/Profile";
import Guild from "src/models/Guild";
import { displayErrors, displaySuccess } from "src/utils";

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
    try {
      await this.guild.accept(this.model.get("id"));
      this.saved("accepted");
    } catch (err) {
      displayErrors(err);
    }
  }

  async onRefuseClicked() {
    try {
      await this.guild.reject(this.model.get("id"));
      this.saved("refused");
    } catch (err) {
      displayErrors(err);
    }
  }

  saved(method: "accepted" | "refused") {
    if (method === "accepted") {
      displaySuccess(`You accepted ${this.model.get("name")} into your guild`);
    } else if (method === "refused") {
      displaySuccess(
        `You refused ${this.model.get("name")}'s request to join your guild`
      );
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
