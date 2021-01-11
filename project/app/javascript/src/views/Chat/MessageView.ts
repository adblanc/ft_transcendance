import Backbone from "backbone";
import Mustache from "mustache";
import moment from "moment";
import { eventBus } from "src/events/EventBus";
import Message from "src/models/Message";
import _ from "underscore";
import { formatMessageDate } from "src/utils";

const MSG_TEMPLATE_ID = "#message-template";
const MSG_NOTIFICATION_TEMPLATE_ID = "#message-notification-template";

export default class MessageView extends Backbone.View<Message> {
  constructor(options?: Backbone.ViewOptions<Message>) {
    super(options);

    if (!this.model) {
      throw Error("Please provide a Message model.");
    }
  }

  events() {
    return {
      "click .user-avatar": () =>
        eventBus.trigger("chat:profile-clicked", this.model),
    };
  }

  render() {
    const isNotification = this.model.get("is_notification");

    const template = $(
      isNotification ? MSG_NOTIFICATION_TEMPLATE_ID : MSG_TEMPLATE_ID
    ).html();

    const html = Mustache.render(template, {
      ...this.model.toJSON(),
      date: formatMessageDate(this.model.get("created_at")),
    });
    this.$el.html(html);

    return this;
  }
}
