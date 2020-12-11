import Backbone from "backbone";
import _ from "underscore";
import Profile from "src/models/Profile";
import Profiles from "src/collections/Profiles";

interface IGame
{
    Id?: number;
    Type: string;
    Points: number;
    url?: string;
    user: Profile;
}

type CreatableGameArgs = Partial<Pick<IGame, "Id" | "Points" | "Type" | "url">>;

export default class Game extends Backbone.AssociatedModel {
	preinitialize() {
		this.relations = [
			{
				type: Backbone.Many,
				key: "users",
				collectionType: Profiles,
				relatedModel: Profile,
			}
		];
    }
    
    constructor(options?: any)
    {
        super(options);
    }

    defaults() {
        return {
        Type: '',
        Points: 0,
        users: []
        };  }
   
    urlRoot = () => "http://localhost:3000/games";

   sync(method: string, model: Game, options: JQueryAjaxSettings): any {
    if (method == "create") {
      var formData = new FormData();

      _.each(model.attributes, function (value, key) {
		formData.append(key, value);
      });
      _.defaults(options || (options = {}), {
        data: formData,
        processData: false,
		contentType: false,
      });
    }
    return Backbone.sync.call(this, method, model, options);
  }

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


   
    createGame(attrs: CreatableGameArgs, error: (errors: string[]) => void, success: () => void) {
       this.set(attrs),
        this.save(
            {},
            {
              url: this.urlRoot(),
              success: () => success(),
              // error: (_, jqxhr) => {
              //   error(this.mapServerErrors(jqxhr?.responseJSON));};
            }
          );
       // success();
    }

}

// type rec = Record<string, string>;

// mapServerErrors(errors: rec) {
//     return Object.keys(errors).map((key) => `${key} ${errors[key].join(",")}`);
//   }
// }