import { BASE_ROOT } from "src/constants";
import BaseModel from "src/lib/BaseModel";
import { IProfile } from "./Profile";
import Room from "./Room";

interface IRoomUser extends IProfile {
  roomRole: "Owner" | "Administrator" | "Member";
  isRoomAdministrator?: boolean;
}

export default class RoomUser extends BaseModel<IRoomUser> {
  updateRole(action: "promote" | "demote") {
    const room = (this.collection as any).parents[0] as Room;

    console.log("room", room);
    return this.asyncSave(
      {
        update_action: action,
      },
      {
        url: `${BASE_ROOT}/${room.get("id")}/${this.get("id")}/update_role`,
      }
    );
  }

  canBePromote() {
    return this.get("roomRole") === "Member";
  }

  canBeDemote() {
    return this.get("roomRole") === "Administrator";
  }
}
