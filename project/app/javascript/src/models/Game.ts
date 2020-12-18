import Backbone from "backbone";
import _ from "underscore";
import Profile from "src/models/Profile";
import Profiles from "src/collections/Profiles";
import { mapServerErrors, syncWithFormData } from "src/utils";
import BaseModel from "src/lib/BaseModel";
import { BASE_ROOT } from "src/constants";

interface IGame {
  id?: string;
  level: string;
  points: number;
  user: Profile;
}

type CreatableGameArgs = Partial<
  Pick<IGame, "id" | "points" | "level">
>;

export default class Game extends BaseModel<IGame> {
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

  constructor(options?: any) {
    super(options);
  }

  defaults() {
    return {
      level: "",
      points: 0,
    };
  }

  urlRoot = () => `${BASE_ROOT}/games`;
  baseGuildRoot = () => `${this.urlRoot()}/${this.get("id")}`;

  sync(method: string, model: Game, options: JQueryAjaxSettings): any {
    return syncWithFormData(method, model, options);
  }

  createGame(attrs: CreatableGameArgs) {
    return this.asyncSave(attrs, { url: this.urlRoot() });
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
}

// type rec = Record<string, string>;

// mapServerErrors(errors: rec) {
//     return Object.keys(errors).map((key) => `${key} ${errors[key].join(",")}`);
//   }
// }
