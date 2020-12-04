import Backbone from "backbone";
import Mustache from "mustache";
import Rooms from "src/collections/Rooms";
import Room from "src/models/Room";
import { displayToast } from "src/utils";

type Options = Backbone.ViewOptions & {
  rooms: Rooms;
};

export default class CreateJoinChannelView extends Backbone.View {
  isJoin: boolean;
  rooms: Rooms;

  constructor(options: Options) {
    super(options);

    if (!options.rooms) {
      throw Error("Please provide a room collection to this view.");
    }

    this.isJoin = false;
    this.rooms = options.rooms;
  }

  events() {
    return {
      "click #switch-create-join": this.switchCreateJoin,
      "click #create-channel": "onSubmit",
    };
  }

  async onSubmit() {
    const name = this.nameInput().val() as string;
    const password = this.passwordInput().val() as string;

    let room: Room = undefined;

    try {
      if (!this.isJoin) {
        room = await this.createChannel(name, password);
      } else {
        room = await this.joinChannel(name, password);
      }

      this.rooms.add(room);

      this.clearInput();

      displayToast(
        {
          text: `Room ${name} successfully ${
            this.isJoin ? "joined" : "created"
          }.`,
        },
        "success"
      );
    } catch (err) {
      displayToast({ text: err }, "error");
    }
  }

  private nameInput = () => this.$("#channel-name");
  private passwordInput = () => this.$("#channel-password");

  async createChannel(name: string, password: string) {
    const room = new Room();
    await room.asyncSave({ name: name, password: password });

    return room;
  }

  async joinChannel(name: string, password: string) {
    const room = new Room({
      name,
      password,
    });
    await room.asyncFetch({
      url: "http://localhost:3000/join-room",
      data: room.toJSON(),
    });

    return room;
  }

  private clearInput() {
    this.nameInput().val("");
    this.passwordInput().val("");
  }

  switchCreateJoin() {
    this.isJoin = !this.isJoin;
    this.render();
  }

  render() {
    const template = $("#create-join-channel-template").html();
    const html = Mustache.render(template, {
      isJoin: this.isJoin,
    });
    this.$el.html(html);

    return this;
  }
}
