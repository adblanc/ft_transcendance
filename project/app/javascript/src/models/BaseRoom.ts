import RoomUsers from "src/collections/RoomUsers";
import { BASE_ROOT } from "src/constants";
import BaseModel from "src/lib/BaseModel";

export interface IRoom {
  users?: RoomUsers;
  name: string;
  password?: string;
  id?: number;
  selected?: boolean;
}

export default class BaseRoom extends BaseModel<IRoom> {
  join() {
    return this.asyncFetch({
      url: `${BASE_ROOT}/join-room`,
      data: this.toJSON(),
    });
  }
}
