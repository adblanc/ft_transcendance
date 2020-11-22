import Backbone from "backbone";
import "backbone-associations";

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
  /*relations = () => {
    return [
      {
        type: Backbone.Many,
        key: 'users',
        relatedModel: 'Profile',
      },
    ];
  };*/
  relations: [{
	type: 'Backbone.Many',
	key: 'users',
	relatedModel: 'Profile'
	}]

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
    profile: Backbone.Model,
    error: (errors: string[]) => void,
    success: () => void
  ) {
	this.set(attrs);
	this.set({users: profile});
	console.log(this.get('users'));

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

//Guild.setup();
