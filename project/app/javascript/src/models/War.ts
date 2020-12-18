import Backbone from "backbone";
import _ from "underscore";
import Guild from "src/models/Guild";
import { mapServerErrors, syncWithFormData } from "src/utils";
import BaseModel from "src/lib/BaseModel";
import Guilds from "src/collections/Guilds";

interface IWar {
  id: string;
  start: Date;
  end: Date;
  status: string;
  prize: string;
  guilds: Guilds;
  created_at: string;
  updated_at: string;
}

export type WAR_ACTION = "accept" | "reject";

export default class War extends BaseModel<IWar> {
	preinitialize() {
		this.relations = [
		  {
			type: Backbone.Many,
			key: "guilds",
			collectionType: Guilds,
			relatedModel: Guild,
		  },
		];
	  }

  constructor(options?: any) {
    super(options);
  }

  urlRoot = () => "http://localhost:3000/wars";
  baseGuildRoot = () => `${this.urlRoot()}/${this.get("id")}`;

  sync(method: string, model: Guild, options: JQueryAjaxSettings): any {
    return syncWithFormData(method, model, options);
  }

  createWar(start: Date, end:Date, prize: string, initiator_id: string, recipient_id: string) {
    return this.asyncSave( 
		{
			'start': start,
			'end': end,
			'prize': prize,
			'initiator_id': initiator_id,
			'recipient_id': recipient_id,
		}, 
		{ 
			url: this.urlRoot() 
		});
	}

	manageAction(method: WAR_ACTION) {
		return this.asyncSave({},
		  {
			url: `${this.baseGuildRoot()}/${method}`,
		  }
		);
	  }
	
	  accept() {
		return this.asyncSave({},
		  {
			url: `${this.baseGuildRoot()}/accept`,
		  }
		);
	  }
	
	  reject() {
		return this.asyncSave({},
		  {
			url: `${this.baseGuildRoot()}/reject`,
		  }
		);
	  }
	  
}


