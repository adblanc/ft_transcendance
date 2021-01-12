import { BASE_ROOT } from "src/constants";
import BaseModel from "src/lib/BaseModel";

export interface IMessage {
  content: string;
  room_id: number;
  is_notification?: boolean;
  sent?: boolean;
  id?: number;
  avatar_url?: string;
  user_id?: number;
  user_login?: string;
  created_at?: string;
  updated_at?: string;
  ancient?: boolean;
}

export default class Message extends BaseModel<IMessage> {
  url = () => `${BASE_ROOT}/room_messages`;
}
