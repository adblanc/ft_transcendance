import Backbone from "backbone";

import _ from "underscore";
import Profile from "src/models/Profile";

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

export default class Guild extends Backbone.AssociatedModel {
  constructor(options?: any) {
	super(options);

    this.relations = [
      {
        type: Backbone.Many,
        key: "users",
        relatedModel: Profile,
      },
	];

	/*this.defaults = {
        users: []
    };*/
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
	//this.set({ users: [0] });
	this.get('users').at(0).set(profile);
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
