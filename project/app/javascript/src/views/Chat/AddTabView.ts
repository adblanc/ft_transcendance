import Mustache from "mustache";
import { eventBus } from "src/events/EventBus";
import BaseView from "../BaseView";

type Props = Backbone.ViewOptions & {
  isOdd: boolean;
};

export default class AddTabView extends BaseView {
  private isOdd: boolean;

  constructor(options?: Props) {
    super(options);

    this.isOdd = options.isOdd;
  }

  events() {
    return {
      "click #chat-add-tab": "chatAddTab",
    };
  }

  chatAddTab() {
    eventBus.trigger("chat:tabs:add");
  }

  render() {
    const template = $("#chatAddTabTemplate").html();
    const html = Mustache.render(template, { isOdd: this.isOdd });
    this.$el.html(html);

    return this;
  }
}
