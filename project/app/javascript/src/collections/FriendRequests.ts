import Backbone from "backbone";
import FriendRequest from "../models/FriendRequest";

export default class FriendRequests extends Backbone.Collection<FriendRequest> {
  constructor() {
    super();

    this.model = FriendRequest;
  }
}
