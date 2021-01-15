import Backbone from "backbone";
import _ from "underscore";
import Profile from "src/models/Profile";
import Profiles from "src/collections/Profiles";
import { displaySuccess, mapServerErrors, syncWithFormData } from "src/utils";
import BaseModel from "src/lib/BaseModel";
import { BASE_ROOT } from "src/constants";
import consumer from "channels/consumer";
import Mouvement from "src/models/Mouvement";
import IMouvement from "src/models/Mouvement";
import Mouvements from "src/collections/Mouvements";

interface IGame {
  id: string;
  level: string;
  goal: number;
  status: string;
  users: Profiles;
}

type CreatableGameArgs = Partial<
  Pick<IGame, "goal" | "level">
>;

export default class Game extends BaseModel<IGame> {
  first: Number;
  second?: boolean;
  channel: ActionCable.Channel;
  mouvements: Mouvements;
  model: Mouvement;
  currentUserId?: Number;
  preinitialize() {
    this.relations = [
      {
        type: Backbone.Many,
        key: "users",
        collectionType: Profiles,
        relatedModel: Profile,
      },
    ];
  }

  constructor(options?: any) {
	super(options);
	
	this.second = false;
    this.mouvements = new Mouvements();
    this.model = new Mouvement();
    this.channel = this.createConsumer();
    this.currentUserId = undefined;
  }

  defaults() {
    return {
      users: [],
    };
  }

  urlRoot = () => `${BASE_ROOT}/games`;
  baseGameRoot = () => `${this.urlRoot()}/${this.get("id")}`;

  sync(method: string, model: Game, options: JQueryAjaxSettings): any {
    return syncWithFormData(method, model, options);
  }

  createGame(attrs: CreatableGameArgs) {
    return this.asyncSave(attrs, { url: this.urlRoot() });
  }

  score(user_id: string) {
    return this.asyncSave(user_id, { url: this.baseGameRoot() });
  }

  createConsumer() {
    const game_id = this.get("id");

    return consumer.subscriptions.create(
      { channel: "GamingChannel", game_id },
      {
        connected: () => {
          console.log("connected to the GAMMME", game_id);
        },
        received: (mouv: IMouvement) => {
          console.log(JSON.stringify(mouv));
          if (!this.currentUserId) {
            this.currentUserId = parseInt(
              $("#current-user-profile").data("id")
            );
          }
          this.model.set(mouv);
          if (this.currentUserId === this.model.get("user_id")) {
            this.model.set({ sent: true });
          } else {
            this.model.set({ sent: false });
          }
        },
        disconnected: () => {
          console.log("disconnected to the GAMMME", game_id);
        },
      }
    );
  }
}

//  sync(method: string, model: Game, options: JQueryAjaxSettings): any {
//   if (method == "create") {
//     var formData = new FormData();

//     _.each(model.attributes, function (value, key) {
// 	formData.append(key, value);
//     });
//     _.defaults(options || (options = {}), {
//       data: formData,
//       processData: false,
// 	contentType: false,
//     });
//   }
//   return Backbone.sync.call(this, method, model, options);
// }

//    user = new Profile();
//     Points: number;
//     Type: string;
// constructor(Id: number, type: string, Pts: number, Profil: Profile) {
//     super();
//     this.set(this.Type: type);
//     this.user = Profil;
//     this.Points = Pts;
//     this.url = this.urlRoot;
//     console.log(this.id);
// }

// createGame(attrs: CreatableGameArgs,  success: () => void) {
//    this.set(attrs),
//     this.save(
//         {},
//         {
//           url: this.urlRoot(),
//           success: () => success(),
//           // error: (_, jqxhr) => {
//           //   error(this.mapServerErrors(jqxhr?.responseJSON));};
//         }
//       );
//    // success();
// }
//}

// type rec = Record<string, string>;

// mapServerErrors(errors: rec) {
//     return Object.keys(errors).map((key) => `${key} ${errors[key].join(",")}`);
//   }
// }
