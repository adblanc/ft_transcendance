import Mustache from "mustache";
import { eventBus } from "src/events/EventBus";
import Tab from "src/models/Tab";
import AddTabView from "./AddTabView";
import BaseView from "./BaseView";
import TabView from "./TabView";

export default class TabsView extends BaseView {
  addTabView: BaseView;
  constructor(options?: Backbone.ViewOptions) {
    super(options);

    if (!this.collection) {
      throw Error("Please pass a Tab collection to TabsView");
    }

    this.addTabView = new AddTabView({ isOdd: false });

    this.listenTo(eventBus, "chat:tabs:add", this.onAddTab);
    this.listenTo(eventBus, "chat:tabs:close", this.onRemoveTab);
    this.listenTo(this.collection, "add", this.addNewTab);
    this.listenTo(this.collection, "remove", this.removeTab);
  }

  onClose = () => {
    this.addTabView.close();
  };

  onAddTab() {
    console.log("add tab");
    this.addTabView.close();

    const id = this.getTabsLength();

    this.collection.add(
      new Tab({
        id,
        name: `join / create channel`,
      })
    );
  }

  getTabsLength() {
    return this.$("#chat-tabs-container").children().length;
  }

  onRemoveTab(tab: Tab) {
    console.log("on remove tab");
    this.collection.remove(tab);
  }

  removeTab(tab: Tab) {
    console.log("remove tab");
    this.$(`.chat-tab#${tab.get("id")}`)
      .parent()
      .remove();

    if (!this.getTabsLength()) {
      this.addTabView = new AddTabView({
        isOdd: false,
      });
      this.renderAddTab();
    }
  }

  render() {
    console.log("render tabs");
    const template = $("#chatTabsTemplate").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

    this.renderAddTab();

    return this;
  }

  renderAddTab() {
    this.appendNested(this.addTabView, "#chat-tabs-container");
  }

  addNewTab(tab: Tab) {
    this.appendNested(
      new TabView({
        model: tab,
      }),
      "#chat-tabs-container"
    );
  }
}
