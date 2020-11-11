import Mustache from "mustache";
import BaseView from "../BaseView";

export default class MessageView extends BaseView {
  render() {
    const template = $("#messageTemplate").html();
    const html = Mustache.render(template, {
      ...this.model.toJSON(),
      sent: this.model.get("type") === "sent",
    });
    this.$el.html(html);

    return this;
  }
}
