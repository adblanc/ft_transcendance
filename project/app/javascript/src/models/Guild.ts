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

export default class Guild extends Backbone.Model {
  urlRoot = () => "http://localhost:3000/guilds";

  /*fetch(options?: ModelFetchOptions): JQueryXHR {
    return super.fetch({
      url: this.urlRoot(),
      ...options,
    });
  }*/

  sync(method: string, model: Guild, options: JQueryAjaxSettings): any {
    return Backbone.sync.call(this, method, model, options);
  }

  /*mapServerErrors(errors: Record<string, string[]>) {
    return Object.keys(errors).map((key) => `${key} ${errors[key].join(",")}`);
  }*/
}