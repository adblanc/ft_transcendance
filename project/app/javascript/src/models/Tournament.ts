import Backbone from "backbone";
import _ from "underscore";
import Profile from "src/models/Profile";
import Profiles from "src/collections/Profiles";
import { syncWithFormData } from "src/utils";
import BaseModel from "src/lib/BaseModel";
import { BASE_ROOT } from "src/constants";
import Games from "src/collections/Games";
import Game from "src/models/Game";

interface ITournament {
  id: string;
  name: string;
  status: string;
  registration_start: Date;
  registration_end: Date;
  trophy_url?: string;
  users: Profiles;
  round_one_games: Games;
  round_two_games: Games;
  round_three_games: Games;
}

type CreatableTournamentArgs = Partial<Pick<ITournament, "name" | "registration_start" | "registration_end" | "trophy_url">>;


export default class Tournament extends BaseModel<ITournament> {
  preinitialize() {
    this.relations = [
      {
        type: Backbone.Many,
        key: "users",
        collectionType: Profiles,
        relatedModel: Profile,
      },
	  {
        type: Backbone.Many,
        key: "round_one_games",
        collectionType: Games,
        relatedModel: Game,
	  },
	  {
        type: Backbone.Many,
        key: "round_two_games",
        collectionType: Games,
        relatedModel: Game,
	  },
	  {
        type: Backbone.Many,
		key: "round_three_games",
		collectionType: Games,
        relatedModel: Game,
	  }
    ];
  }

  constructor(options?: any) {
    super(options);
  }

  defaults() {
    return {
	  users: [],
	  round_one_games: [],
	  round_two_games: [],
	  round_three_games: [],
    };
  }

  urlRoot = () => `${BASE_ROOT}/tournaments`;
  baseGuildRoot = () => `${this.urlRoot()}/${this.get("id")}`;

  sync(method: string, model: Tournament, options: JQueryAjaxSettings): any {
    return syncWithFormData(method, model, options);
  }

  createTournament(attrs: CreatableTournamentArgs) {
    return this.asyncSave(attrs, { url: this.urlRoot() });
  } 

  register() {
    return this.asyncSave(
      {},
      {
        url: `${this.baseGuildRoot()}/register`,
      }
    );
  }

  seed_for_test() {
    return this.asyncSave(
      {},
      {
        url: `${this.baseGuildRoot()}/seed_for_test`,
      }
    );
  }
}
