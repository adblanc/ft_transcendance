import Backbone from "backbone";
import Mustache from "mustache";
import { eventBus } from "src/events/EventBus";
import Message from "src/models/Message";
import _ from "underscore";
import { formatMessageDate } from "src/utils";
import Game from "src/models/Game";

const MSG_TEMPLATE_ID = "#message-template";
const MSG_NOTIFICATION_TEMPLATE_ID = "#message-notification-template";

export default class MessageView extends Backbone.View<Message> {
	game: Game;
	req: boolean;
	pending: boolean;

  constructor(options?: Backbone.ViewOptions<Message>) {
    super(options);

    if (!this.model) {
      throw Error("Please provide a Message model.");
	}
	
	if (this.model.get("game_id")) {
		var id = this.model.get("game_id");
		this.game = new Game({ id });
		this.game.fetch();
		this.req = true;
	} 
	else {
		this.req = false;
	}

	if (this.game != undefined) {
		this.listenTo(this.game, "change", this.statusUpdate);
		this.listenTo(eventBus, "chatplay:change", this.fetchStatusUpdate);
	}
  }

  fetchStatusUpdate() {
	this.game.fetch();
	this.pending = this.game.get("status") === "pending";
	this.render();
  }

  statusUpdate() {
	this.pending = this.game.get("status") === "pending";
	this.render();
  }

  events() {
    return {
      "click .user-avatar": () =>
		eventBus.trigger("chat:profile-clicked", this.model),
		"click #accept": "onAccept",
    };
  }

  async onAccept(e: JQuery.Event) {
	console.log("test");
	e.preventDefault();
  
	const success = await this.game.acceptPlayChat();
	if (success) {
		this.gameSaved();
	}
  }

  gameSaved() {
	this.game.navigateToGame();
  }

  render() {
    const isNotification = this.model.get("is_notification");

    const template = $(
      isNotification ? MSG_NOTIFICATION_TEMPLATE_ID : MSG_TEMPLATE_ID
    ).html();

	const { day, time } = formatMessageDate(this.model.get("created_at"));

    const html = Mustache.render(template, {
      ...this.model.toJSON(),
      day,
	  time,
	  req: this.req,
	  pending : this.pending,
    });
    this.$el.html(html);

    return this;
  }
}
