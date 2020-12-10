import BaseModel from "src/lib/BaseModel";
import { IProfile } from "./Profile";

interface IRoomUser extends IProfile {
  isRoomAdministrator: boolean;
}

export default class RoomUser extends BaseModel<IRoomUser> {}
