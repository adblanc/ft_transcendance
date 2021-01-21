import Backbone from "backbone";
import Mustache from "mustache";
import moment from "moment";
import User from "src/models/User";
import BaseView from "src/lib/BaseView";
import { eventBus } from "src/events/EventBus";
import { currentUser } from "src/models/Profile";
import { displaySuccess } from "src/utils";

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
      "click #add-friend": this.onAddFriend,
    };
  }

  onClickSendDm() {
    eventBus.trigger("chat:open");
    eventBus.trigger("chat:go-to-dm", this.user.get("id"));
  }

  async onAddFriend() {
    const success = await this.user.addFriend();

    if (success) {
      displaySuccess(
        `Your invitation has been sent to ${this.user.get("login")}`
	  );
    }
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
	  no_relation: !this.user.get("is_friend") && !this.user.get("has_received_friend") && !this.user.get("has_requested_friend")
    });
    this.$el.html(html);

    return this;
  }

  actualize() {
    this.user.fetch({ error: this.onFetchError });
  }
}
