import Backbone, { ModelFetchOptions } from "backbone";
import _ from "underscore";

interface IGuild {
  id: string;
  name: string;
  ang: string;
  points: number;
  members: number[];
  atWar: boolean;
  warLog: number[];
  created_at: string;
  updated_at: string;
}

type CreatableGuildArgs = Partial<Pick<IGuild, "name" | "ang">>; //+avatar

export default class Guild extends Backbone.Model {
  urlRoot = () => "http://localhost:3000/guilds";

   //implement message if uniqueness or ang not valid
   validate(name: string, ang: string) {
    if (name && name.length < 3) {
      return "name is too short (minimum length is 3)";
	}
	if (ang && ang.length < 3) {
		return "name is too short (minimum length is 3)";
	  }
	if (ang && ang.length > 5) {
		return "anagram is too long (maximum length is 5)";
	}
    return null;
  }

  sync(method: string, model: Guild, options: JQueryAjaxSettings): any {
    return Backbone.sync.call(this, method, model, options);
  }

  createGuild(
	attrs: CreatableGuildArgs,
    error: (errors: string[]) => void,
    success: () => void
  ) {
	this.set(attrs);

    const valid = this.save(
      {},
      {
        url: this.urlRoot(),

        success: () => success(),
        error: (_, jqxhr) => {
          error(this.mapServerErrors(jqxhr?.responseJSON));
        },
      }
    );

    if (!valid) {
      error([this.validationError]);
    }
  }

  mapServerErrors(errors: Record<string, string[]>) {
    return Object.keys(errors).map((key) => `${key} ${errors[key].join(",")}`);
  }
}