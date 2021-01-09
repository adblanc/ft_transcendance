import RoomUsers from "src/collections/RoomUsers";
import { BASE_ROOT } from "src/constants";
import BaseModel from "src/lib/BaseModel";

export interface IRoom {
  name: string;
  password?: string;
  isOwner?: boolean;
  is_private?: boolean;
  id?: number;
  selected?: boolean;
  users?: RoomUsers;
}

export default class BaseRoom extends BaseModel<IRoom> {
  join() {
    return this.asyncFetch({
      url: `${BASE_ROOT}/join-room`,
      data: this.toJSON(),
    });
  }
}
