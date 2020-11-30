import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../lib/BaseView";
import Notifications from "src/collections/Notifications";
import Notification from "src/models/Notification";
import { eventBus } from "src/events/EventBus";

export default class NotificationsView extends BaseView {
  notifications: Backbone.Collection;

  constructor(options?: Backbone.ViewOptions) {
    super(options);
  
  }
  

  render() {
    const template = $("#notificationsTemplate").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

    return this;
  }
}
