import Backbone from "backbone";
import _ from "underscore";
import Guild from "src/models/Guild";
import WarTime from "src/models/WarTime";
import { syncWithFormData } from "src/utils";
import BaseModel from "src/lib/BaseModel";
import Guilds from "src/collections/Guilds";
import { BASE_ROOT } from "src/constants";
import IWarInclude from "./WarInclude";

interface IWar {
  id: string;
  start: Date;
  end: Date;
  status: string;
  prize: string;
  time_to_answer: string;
  max_unanswered_calls: string;
  inc_tour: boolean;
  atWarTime: boolean;
  guilds: Guilds;
  warOpponent: Guild;
  activeWarTime: WarTime;
  nb_games: number;
  nb_wartimes: number;
  winner: string;
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
      {
        type: Backbone.One,
        key: "warOpponent",
        relatedModel: Guild,
      },
      {
        type: Backbone.One,
        key: "activeWarTime",
        relatedModel: WarTime,
	  },
    ];
  }

  constructor(options?: any) {
    super(options);
  }

  urlRoot = () => `${BASE_ROOT}/wars`;
  baseWarRoot = () => `${this.urlRoot()}/${this.get("id")}`;

  sync(method: string, model: Guild, options: JQueryAjaxSettings): any {
    return syncWithFormData(method, model, options);
  }

  createWar(
    start: Date,
    end: Date,
    prize: string,
    answer_time: string,
	max_calls: string,
	war_include: IWarInclude,
    initiator_id: string,
	recipient_id: string
  ) {
    return this.asyncSave(
      {
        start: start,
        end: end,
        prize: prize,
        time_to_answer: answer_time,
		max_unanswered_calls: max_calls,
		war_include: war_include,
        initiator_id: initiator_id,
        recipient_id: recipient_id,
      },
      {
        url: this.urlRoot(),
      }
    );
  }

  modifyWar(
    start: Date,
    end: Date,
	prize: string,
    answer_time: string,
	max_calls: string,
	inc_tour: boolean
  ) {
    return this.asyncSave(
      {
        start: start,
        end: end,
        prize: prize,
        time_to_answer: answer_time,
		max_unanswered_calls: max_calls,
		inc_tour: inc_tour
      },
      {
        url: this.baseWarRoot(),
      }
    );
  }

  manageAction(method: WAR_ACTION) {
    return this.asyncSave(
      {},
      {
        url: `${this.baseWarRoot()}/${method}`,
      }
    );
  }

  

  activateWarTime(end: Date) {
    return this.asyncSave(
      {
        end: end,
      },
      {
        url: `${this.baseWarRoot()}/activateWarTime`,
      }
    );
  }

}
