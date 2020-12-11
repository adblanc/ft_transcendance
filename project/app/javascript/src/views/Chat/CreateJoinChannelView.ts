import Backbone from "backbone";
import Mustache from "mustache";
import Rooms from "src/collections/Rooms";
import Room from "src/models/Room";
import { displaySuccess } from "src/utils";

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

    const { success, room } = !this.isJoin
      ? await this.createChannel(name, password)
      : await this.joinChannel(name, password);

    if (success) {
      this.rooms.add(room);
      this.clearInput();
      displaySuccess(
        `Room ${name} successfully ${this.isJoin ? "joined" : "created"}.`
      );
    }
  }

  private nameInput = () => this.$("#channel-name");
  private passwordInput = () => this.$("#channel-password");

  async createChannel(name: string, password: string) {
    const room = new Room();
    const success = await room.asyncSave({ name: name, password: password });

    return { room, success };
  }

  async joinChannel(name: string, password: string) {
    const room = new Room({
      name,
      password,
    });
    const success = await room.asyncFetch({
      url: "http://localhost:3000/join-room",
      data: room.toJSON(),
    });

    return { room, success };
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
