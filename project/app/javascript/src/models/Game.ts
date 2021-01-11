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
  id?: string;
  level: string;
  points: number;
  status: string;
  user: Profile;
  first: number;
  button: number;
  //player_points: number;
}

type CreatableGameArgs = Partial<
  Pick<IGame, "id" | "points" | "level" | "status" | "first" | "button">
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
        key: "user",
        collectionType: Profiles,
        relatedModel: Profile,
      },
    ];
  }

  initialize() {
    this.second = false;
    this.mouvements = new Mouvements();
    this.model = new Mouvement();
    this.channel = this.createConsumer();
    this.currentUserId = undefined;
  }

  constructor(options?: any) {
    super(options);
  }

  defaults() {
    return {
      level: "",
      points: 0,
      status: "waiting",
      user: [],
      second: false,
      button: 0,
      //player_points: 0,
    };
  }

  urlRoot = () => `${BASE_ROOT}/games`;
  baseGameRoot = () => `${this.urlRoot()}/${this.get("id")}`;

  sync(method: string, model: Game, options: JQueryAjaxSettings): any {
    return syncWithFormData(method, model, options);
  }

  createGame(attrs: CreatableGameArgs) {
    if (!this.currentUserId) {
      this.currentUserId = parseInt($("#current-user-profile").data("id"));
    }
    this.first = this.currentUserId;
    return this.asyncSave(attrs, { url: this.urlRoot() });
  }
  join() {
    
    if (!this.currentUserId) {
      this.currentUserId = parseInt($("#current-user-profile").data("id"));
    }
     if (this.currentUserId == this.get("first"))
     {
       displaySuccess("You already create this game");
       return 0;
     }
    this.second = true;
    return this.asyncSave({status: "playing", second: true},{ url: `${this.baseGameRoot()}/join`,});
  }

  finish(g_points: number)
  {
    const success = this.asyncSave({status: "finished", points: g_points},{ url: `${this.baseGameRoot()}/finish`,});
    if (success)
    { this.channel.unsubscribe();}
    return success;
  }

  createConsumer() {
    const game_id = this.get("id");

    if (game_id === undefined) {
      return undefined;
    }

    return consumer.subscriptions.create(
      { channel: "GamingChannel", game_id },
      {
        connected: () => {
          console.log("connected to the GAMMME", game_id);
        },
        received: (mouv: IMouvement) => 
        {
          console.log(JSON.stringify(mouv));
          if (!this.currentUserId) {
            this.currentUserId = parseInt(
              $("#current-user-profile").data("id")
            );
          }
           this.model.set(mouv);
           if (this.currentUserId === this.model.get("user_id"))
          {this.model.set({sent: true});}
          else
          {this.model.set({sent: false});}
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
