import Backbone from "backbone";
import Mustache from "mustache";
import moment from "moment";
import User from "src/models/User";
import BaseView from "src/lib/BaseView";
import { eventBus } from "src/events/EventBus";

type Options = Backbone.ViewOptions & { userId: number };

export default class UserView extends BaseView {
  user: User;

  constructor(options: Options) {
    super(options);

    this.user = new User({ id: options.userId });
    this.user.fetch({ error: this.onFetchError });
    this.listenTo(this.user, "change", this.render);
    this.listenTo(eventBus, "profile:change", this.actualize);
  }

  events() {
    return {
      "click #send-dm": this.onClickSendDm,
    };
  }

  onClickSendDm() {
    console.log("send dm");
  }

  onFetchError() {
    Backbone.history.navigate("/not-found", { trigger: true });
  }

  render() {
    const template = $("#userPageTemplate").html();
    const html = Mustache.render(template, {
      ...this.user.toJSON(),
      created_at: moment(this.user.get("created_at"))?.format("DD/MM/YYYY"),
      has_guild: !!this.user.get("guild"),
    });
    this.$el.html(html);

    return this;
  }

  actualize() {
    this.user.fetch({ error: this.onFetchError });
  }
}
