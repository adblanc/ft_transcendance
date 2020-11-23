import Backbone from "backbone";
import _ from "underscore";
import Profile from "src/models/Profile";
import Profiles from "src/collections/Profiles";

interface IGuild {
  id: string;
  name: string;
  ang: string;
  points: number;
  atWar: boolean;
  img?: any;
  created_at: string;
  updated_at: string;
}

type CreatableGuildArgs = Partial<Pick<IGuild, "name" | "ang" | "img">>;

/*const Guild = Backbone.AssociatedModel.extend({
	urlRoot
	relations: [
		{
			type: Backbone.Many,
			key: "users",
			collectionType: Profiles,
			relatedModel: Profile,
		}
	],
	defaults: {
		name: '',
		ang: '',
		points: 0,
		atWar : false,
		users: []
	}

});

export default Guild;*/



export default class Guild extends Backbone.AssociatedModel {
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

  constructor(options?: any) {
	super(options);
  }

  defaults() {
	return {
		name: '',
		ang: '',
		points: 0,
		atWar : false,
		users: []
	};
   }

  urlRoot = () => "http://localhost:3000/guilds";

  sync(method: string, model: Guild, options: JQueryAjaxSettings): any {
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

  createGuild(
    attrs: CreatableGuildArgs,
    profile: Backbone.AssociatedModel,
    error: (errors: string[]) => void,
    success: () => void
  ) {
    this.set(attrs);
	//profile.set({guild: this});
	//profile.set({guild_role: 'owner'});
	//this.set({users: profile});
	this.get("users").add(profile);
	//this.set({ users: [] });
	//this.get('users').at(0).set(profile);
	//this.set('users[0]', profile );
	//this.set({ 'users[0]': profile });
    console.log(this.get("users"));

    this.save(
      {},
      {
        url: this.urlRoot(),

        success: () => success(),
        error: (_, jqxhr) => {
          error(this.mapServerErrors(jqxhr?.responseJSON));
        },
      }
    );
  }

  mapServerErrors(errors: Record<string, string[]>) {
    return Object.keys(errors).map((key) => `${key} ${errors[key].join(",")}`);
  }
}
