import Backbone from "backbone";
import Mustache from "mustache";
import Rooms from "src/collections/MyRooms";
import BaseView from "src/lib/BaseView";
import Message from "src/models/Message";
import Game from "src/models/Game";
import ChatPlayView from "./ChatPlayView";
import _ from "underscore";
import Room from "src/models/Room";
import { eventBus } from "src/events/EventBus";

type Options = Backbone.ViewOptions & {
  rooms: Rooms;
};

export default class ChatInputView extends BaseView {
  rooms: Rooms;
  disable: boolean;

  constructor(options?: Options) {
    super(options);

	this.rooms = options.rooms;
	this.disable = false;
	this.disablePlay();
	this.listenTo(eventBus, "chatplay:change", this.disablePlay);
  }

  events() {
    return {
      "keypress #send-message-input": this.onKeyPress,
	  "click #send-message-btn": this.sendMessage,
	  "click #chat-play-btn": this.onPlay,
    };
  }

  onPlay() {
	const game = new Game();
	const chatPlayView = new ChatPlayView({
		model: game,
		room_id: this.rooms.selectedRoom.get("id"),
	});
	
	chatPlayView.render();
  }

  async onKeyPress(e: JQuery.Event) {
    if (e.key !== "Enter") {
      return;
    }
    e.preventDefault();

    await this.sendMessage();
  }

  sendMessage() {
    const content = this.$("#send-message-input").val() as string;

    if (!content) {
      return;
    }

    const message = new Message({
      content,
      room_id: this.rooms.selectedRoom.get("id"),
    });

    this.clearInput();

    return message.asyncSave();
  }

  clearInput() {
    this.$("#send-message-input").val("");
  }

  disablePlay() {
	this.disable = false;
	this.rooms.fetch({
		success: () => {
			this.rooms.selectedRoom.get("messages").forEach(function (item) {
				if (item.get("game") && item.get("game").get("status") === "pending") {
					this.disable = true;
				}
			}, this);
			if (this.disable == false) {
				this.rooms.selectedRoom.get("users").forEach(function (item) {
					console.log(item);
					if (item.get("pendingGame")) {
						console.log("test2");
						this.disable = true;
					}
					else if (item.get("inGame") == true) {
						this.disable = true;
					}
				}, this);
			}
			console.log(this.disable);
			this.render();
		}
	});
  }

  render() {
    const template = $("#chat-input-template").html();
    const html = Mustache.render(template, {disable: this.disable});
	this.$el.html(html);

    return this;
  }
}
