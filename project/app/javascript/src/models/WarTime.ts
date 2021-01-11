import Backbone from "backbone";
import _ from "underscore";
import War from "src/models/War";
import { mapServerErrors, syncWithFormData } from "src/utils";
import BaseModel from "src/lib/BaseModel";
import Guilds from "src/collections/Guilds";

interface IWarTime {
  id: string;
  end: Date;
  time_to_answer: string;
  max_unanswered_calls: string;
  unanswered_calls: string;
  created_at: string;
  updated_at: string;
}

export default class WarTime extends BaseModel<IWarTime> {
	preinitialize() {
		this.relations = [
		  {
			type: Backbone.One,
			key: "war",
			relatedModel: War,
		  },
		];
	  }

  constructor(options?: any) {
    super(options);
  }
}


