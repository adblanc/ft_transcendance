import Mustache from "mustache";
import BaseView from "./BaseView";
import Message from "src/models/Message";
import MessageView from "./MessageView";
import Tabs from "src/collections/Tabs";
import TabsView from "./TabsView";

export default class ChatView extends BaseView {
  tabs: Backbone.Collection;
  tabsView: BaseView;
  constructor(options?: Backbone.ViewOptions) {
    super(options);

    this.tabs = new Tabs();
    this.tabsView = new TabsView({
      collection: this.tabs,
    });

    this.listenTo(this.collection, "add", this.onAddMessage);
    this.listenTo(this.collection, "remove", this.onRemoveMessage);
  }

  onClose = () => {
    this.tabsView.close();
  };

  events() {
    return {
      "keypress #input-message": "onKeyPressInput",
    };
  }

  onKeyPressInput() {
    console.log("key pressed");
  }

  onAddMessage(message: Message) {
    console.log("add message");
    const view = new MessageView({
      model: message,
    });
    const el = view.render().$el;

    this.$("#messages-container").append(el);
  }

  onRemoveMessage() {
    console.log("remove message");
  }

  render() {
    const template = $("#chatTemplate").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

    this.preprendNested(this.tabsView, "#chat-container");

    return this;
  }
}
