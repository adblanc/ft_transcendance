import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "src/lib/BaseView";
import AdminRoom from "src/models/AdminRoom";
import RoomMessagesView from "./RoomMessagesView";

export default class AdminRoomView extends BaseView<AdminRoom> {
	roomMessagesView: RoomMessagesView;

  constructor(options?: Backbone.ViewOptions<AdminRoom>) {
    super(options);

    if (!this.model) {
      throw Error("Please provide a AdminRoom model.");
    }

    this.listenTo(this.model, "change", this.render);
	this.roomMessagesView = undefined;
  }

  onClose = () => {
  	this.roomMessagesView?.close();
  };

  events() {
    return {
      "click .room-name": this.onClick,
    };
  }

  onClick() {
  	if (!this.model.get("selected")) {
		this.model.select();
	}
  }

  renderMessages() {
    if (this.roomMessagesView) {
      this.roomMessagesView.close();
    }
    this.roomMessagesView = new RoomMessagesView({ model: this.model });
    this.roomMessagesView.render();
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

	if (this.model.get("selected")) {
		this.renderMessages();
	}

    return this;
  }
}
