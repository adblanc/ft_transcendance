import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../lib/BaseView";
import Notification from "src/models/Notification";
import moment from "moment";

type Options = Backbone.ViewOptions & {
  notification: Notification;
  page: boolean;
};

export default class ItemView extends BaseView {
  notification: Notification;
  momentString: string;
  page: boolean;

  constructor(options?: Options) {
    super(options);

    this.notification = options.notification;
    this.page = options.page;

    this.listenTo(this.notification, "change", this.render);
  }

  render() {
    const notif = {
      ...this.notification.toJSON(),
      created_at: moment(this.notification.get("created_at")).format(
        "MMM Do YY, h:mm a"
      ),
      notifiable_type: this.notification.get("notifiable_type").toLowerCase(),
    };

    const template = $("#notifTemplate").html();
    const html = Mustache.render(template, notif);
    this.$el.html(html);

    if (this.page) {
      this.$("#notif-item").addClass("notifpage");
    }

    return this;
  }
}
