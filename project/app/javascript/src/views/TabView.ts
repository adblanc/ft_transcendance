import Mustache from "mustache";
import { eventBus } from "src/events/EventBus";
import Tab from "src/models/Tab";
import BaseView from "./BaseView";

export default class TabView extends BaseView<Tab> {
  constructor(options?: Backbone.ViewOptions<Tab>) {
    super(options);

    this.verifyModelExists();
  }

  events() {
    return { "click #close": "onCloseTab" };
  }

  onCloseTab() {
    eventBus.trigger("chat:tabs:close", this.model);
  }

  render() {
    const template = $("#chatTabTemplate").html();
    const html = Mustache.render(template, {
      ...this.model.toJSON(),
      odd: this.model.get("id") % 2,
    });
    this.$el.html(html);

    return this;
  }
}
