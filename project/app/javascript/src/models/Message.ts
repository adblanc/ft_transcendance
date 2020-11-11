import Backbone from "backbone";

interface IMessage {
  content: string;
  type: "received" | "sent";
  avatar_url: string;
}

export default class Message extends Backbone.Model<IMessage> {}
