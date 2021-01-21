import Backbone from "backbone";
import { BASE_ROOT } from "src/constants";
import BaseModel from "src/lib/BaseModel";
import { IProfile } from "./Profile";
import FriendRequests from "src/collections/FriendRequests";
import Friends from "src/collections/Friends";

export default class User extends BaseModel<IProfile> {
  urlRoot = () => `${BASE_ROOT}/profile/`;
  baseUserRoot = () => `${this.urlRoot()}/${this.get("id")}`;

  preinitialize() {
    this.relations = [
	  {
        type: Backbone.Many,
        key: "friend_requests",
        collectionType: FriendRequests,
        relatedModel: User,
	  },
	  {
        type: Backbone.Many,
        key: "friends",
        collectionType: Friends,
        relatedModel: User,
      },
    ];
  }

  addFriend() {
    return this.asyncSave(
      {},
      {
        url: `${this.baseUserRoot()}/add_friend`
      }
    );
  }

  acceptFriend() {
    return this.asyncSave(
      {},
      {
        url: `${this.baseUserRoot()}/accept_friend`
      }
    );
  }

  refuseFriend() {
    return this.asyncSave(
      {},
      {
        url: `${this.baseUserRoot()}/refuse_friend`
      }
    );
  }

  removeFriend() {
    return this.asyncSave(
      {},
      {
        url: `${this.baseUserRoot()}/remove_friend`
      }
    );
  }
}
