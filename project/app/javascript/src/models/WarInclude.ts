import Backbone from "backbone";
import _ from "underscore";
import BaseModel from "src/lib/BaseModel";
import War from "src/models/War"


type LevelHash = {
	easy: boolean;
	normal: boolean;
	hard: boolean;
};

type GoalHash = {
	three: boolean;
	six: boolean;
	nine: boolean;
};

export default interface IWarInclude{
	inc_ladder: boolean;
	inc_tour: boolean;
	inc_friendly: boolean;
	level: LevelHash;
	goal: GoalHash;
  }
  
/*export default class WarInclude extends BaseModel<IWarInclude> {
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
	
	  defaults() {
		return {
		  inc_ladder: false,
		  inc_tour: false,
		  inc_friendly: false,
		  level: [false, false, false],
		  goal: [false, false, false],
		};
	  }
}*/
  