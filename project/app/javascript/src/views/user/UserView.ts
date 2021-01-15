import Backbone from "backbone";
import Mustache from "mustache";
import moment from "moment";
import User from "src/models/User";
import BaseView from "src/lib/BaseView";
import { eventBus } from "src/events/EventBus";
import { currentUser } from "src/models/Profile";

type Options = Backbone.ViewOptions & { userId: number };

export default class UserView extends BaseView {
  user: User;

  constructor(options: Options) {
    super(options);

    this.user = new User({ id: options.userId, login: "" });
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
    eventBus.trigger("chat:open");
    eventBus.trigger("chat:go-to-dm", this.user.get("id"));
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
      is_current_user: this.user.get("id") === currentUser().get("id"),
    });
    this.$el.html(html);

    return this;
  }

  actualize() {
    this.user.fetch({ error: this.onFetchError });
  }
}
