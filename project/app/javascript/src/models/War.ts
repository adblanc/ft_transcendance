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
  status: number;
  prize: string;
  guilds: Guilds;
  created_at: string;
  updated_at: string;
}

type CreatableWarArgs = Partial<Pick<IWar, "start" | "end" | "prize">>;

export default class War extends BaseModel<IWar> {
	preinitialize() {
		this.relations = [
		  {
			type: Backbone.Many,
			key: "guilds",
			//collectionType: Guilds,
			relatedModel: Guild,
		  },
		];
	  }

  constructor(options?: any) {
    super(options);
  }

  urlRoot = () => "http://localhost:3000/wars";

  sync(method: string, model: Guild, options: JQueryAjaxSettings): any {
    return syncWithFormData(method, model, options);
  }

  createWar(attrs: CreatableWarArgs) {
    return this.asyncSave(attrs, { 
			url: this.urlRoot() 
		});
  	}
}


