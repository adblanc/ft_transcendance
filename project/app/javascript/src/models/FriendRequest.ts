import Backbone from "backbone";
import _ from "underscore";
import BaseModel from "src/lib/BaseModel";
import User from "./User";

interface IFriendRequest {
  id: string;
  requestor: User;
  receiver: User;
  created_at: string;
  updated_at: string;
}

export default class FriendRequest extends BaseModel<IFriendRequest> {
	preinitialize() {
		this.relations = [
		  {
			type: Backbone.One,
			key: "requestor",
			relatedModel: User,
		  },
		  {
			type: Backbone.One,
			key: "receiver",
			relatedModel: User,
		  },
		];
	  }

  constructor(options?: any) {
    super(options);
  }
}


