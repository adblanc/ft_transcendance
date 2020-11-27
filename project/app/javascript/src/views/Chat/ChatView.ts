import Mustache from "mustache";
import Rooms from "src/collections/Rooms";
import PageView from "src/lib/PageView";
import Room from "src/models/Room";
import { displayToast } from "src/utils";
import RoomView from "./RoomView";

export default class ChatView extends PageView {
  rooms: Rooms;
  constructor(options?: any) {
    super(options);

    this.rooms = new Rooms();

    this.rooms.fetch();

    this.listenTo(this.rooms, "add", this.renderRoom);
    this.listenTo(this.rooms, "remove", this.removeRoom);
  }

  renderRoom(room: Room) {
    this.$("#room-list").append(new RoomView({ model: room }).render().el);
  }

  removeRoom(room: Room) {
    this.$(`#room-${room.get("id")}`).remove();
  }

  events() {
    return {
      "click #create-channel": "onSubmit",
    };
  }

  async onSubmit() {
    const nameInput = this.$("#channel-name");
    const passwordInput = this.$("#channel-password");
    const name = nameInput.val() as string;
    const password = passwordInput.val() as string;

    const room = new Room({ name, password });

    try {
      await room.asyncSave();

      this.rooms.add(room);

      nameInput.val("");
      passwordInput.val("");

      displayToast({ text: `Room ${name} successfully created.` }, "success");
    } catch (err) {
      displayToast({ text: err }, "error");
    }
  }

  render() {
    const template = $("#chat-container-template").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

    return this;
  }
}
