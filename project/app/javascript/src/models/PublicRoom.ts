import Backbone from "backbone";
import RoomUsers from "src/collections/RoomUsers";
import BaseModel from "src/lib/BaseModel";
import { IRoom } from "./Room";
import RoomUser from "./RoomUser";

export default class PublicRoom extends BaseModel<IRoom> {
  preinitialize() {
    this.relations = [
      {
        type: Backbone.Many,
        key: "users",
        collectionType: RoomUsers,
        relatedModel: RoomUser,
      },
    ];
  }
}
