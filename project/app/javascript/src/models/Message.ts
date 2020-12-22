import Backbone from "backbone";
import { BASE_ROOT } from "src/constants";

export interface IMessage {
  content: string;
  room_id: number;
  sent?: boolean;
  id?: number;
  user_id?: number;
  user_login?: string;
  created_at?: string;
  updated_at?: string;
}

export default class Message extends Backbone.Model<IMessage> {
  url = () => `${BASE_ROOT}/room_messages`;
}
