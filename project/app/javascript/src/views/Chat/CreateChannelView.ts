import Mustache from "mustache";
import BaseView from "../BaseView";

export default class CreateJoinChannelView extends BaseView {
  isJoinChannel: boolean;
  constructor(options?: Backbone.ViewOptions) {
    super({ className: "flex-1", ...options });

    this.isJoinChannel = false;
  }

  events() {
    return {
      "click #switch-create-join-channel": "toggle",
    };
  }

  toggle() {
    this.isJoinChannel = !this.isJoinChannel;

    this.render();
  }

  render() {
    const template = $("#createChannelTemplate").html();
    const html = Mustache.render(template, {
      createChannel: !this.isJoinChannel,
    });
    this.$el.html(html);

    return this;
  }
}
