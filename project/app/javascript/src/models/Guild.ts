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