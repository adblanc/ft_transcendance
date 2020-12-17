import Backbone from "backbone";
import _ from "underscore";
import Guild from "src/models/Guild";
import { mapServerErrors, syncWithFormData } from "src/utils";
import BaseModel from "src/lib/BaseModel";
import Guilds from "src/collections/Guilds";

interface IGuildWar {
  id: string;
  war_id: string;
  guild_id: string;
  points: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default class GuildWar extends BaseModel<IGuildWar> {

  constructor(options?: any) {
    super(options);
  }

  urlRoot = () => `http://localhost:3000/${this.get("guild_id")}/wars`;

  sync(method: string, model: Guild, options: JQueryAjaxSettings): any {
    return syncWithFormData(method, model, options);
  }
	  
}


