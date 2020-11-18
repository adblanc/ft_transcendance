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
  img?: any;
  created_at: string;
  updated_at: string;
}

type CreatableGuildArgs = Partial<Pick<IGuild, "name" | "ang" | "img">>; //+avatar

export default class Guild extends Backbone.Model {
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
    error: (errors: string[]) => void,
    success: () => void
  ) {
	//console.log(attrs.avatar);
	this.set(attrs);

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