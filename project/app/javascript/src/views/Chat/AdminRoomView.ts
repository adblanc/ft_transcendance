import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "src/lib/BaseView";
import AdminRoom from "src/models/AdminRoom";
//import JoinAdminChannelView from "./JoinAdminChannelView";

export default class AdminRoomView extends BaseView<AdminRoom> {
  constructor(options?: Backbone.ViewOptions<AdminRoom>) {
    super(options);

    if (!this.model) {
      throw Error("Please provide a AdminRoom model.");
    }

    this.listenTo(this.model, "change", this.render);
  }

  events() {
    return {
      "click .room-name": this.onClick,
    };
  }

  onClick() {
    console.log("admin room clicked");
   // const joinAdminChannelView = new JoinAdminChannelView({
   //   model: this.model,
   // });

   // joinAdminChannelView.render();
  }

  render() {
    const template = $("#roomTemplate").html();
    const html = Mustache.render(template, {
		...this.model.toJSON(),
		name: this.model.attributes.is_dm ?
			this.model.attributes.users.models[0].attributes.login + " - " +
			this.model.attributes.users.models[1].attributes.login :
			this.model.attributes.name,
	});
    this.$el.html(html);

    return this;
  }
}
