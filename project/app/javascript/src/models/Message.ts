import Backbone from "backbone";

export interface IMessage {
  content: string;
  room_id: number;
  username?: string;
  created_at?: string;
  updated_at?: string;
}

export default class Message extends Backbone.Model<IMessage> {
  url = () => "http://localhost:3000/room_messages";
}
