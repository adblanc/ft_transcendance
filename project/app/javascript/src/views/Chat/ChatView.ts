import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import Message from "src/models/Message";
import MessageView from "./MessageView";
import Tabs from "src/collections/Tabs";
import TabsView from "./TabsView";
import { eventBus } from "src/events/EventBus";
import CreateChannelView from "./CreateChannelView";
import InputView from "./InputView";

export default class ChatView extends BaseView {
  tabs: Backbone.Collection;
  tabsView: BaseView;
  createChannelView: BaseView;
  inputView: BaseView;
  constructor(options?: Backbone.ViewOptions) {
    super(options);

    this.tabs = new Tabs();
    this.tabsView = new TabsView({
      collection: this.tabs,
    });

    this.inputView = new InputView({
      className: "p-3",
    });

    this.listenTo(eventBus, "chat:tabs:add", this.onAddTab);
    this.listenTo(eventBus, "chat:tabs:empty", this.onEmptyTabs);
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

  onAddTab() {
    this.createChannelView = new CreateChannelView({});
    this.appendNested(this.createChannelView, "#chat-container");
    this.inputView.close();
  }

  onEmptyTabs() {
    this.inputView.close();
    this.createChannelView.close();
  }

  render() {
    const template = $("#chatTemplate").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

    this.preprendNested(this.tabsView, "#chat-container");

    return this;
  }
}
