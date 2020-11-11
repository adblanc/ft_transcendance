import Backbone, { ModelFetchOptions } from "backbone";
import _ from "underscore";

interface IProfile {
  login: string;
  name: string;
  avatar?: any;
  created_at: string;
  updated_at: string;
}

type ModifiableProfileArgs = Partial<Pick<IProfile, "name" | "avatar">>;

export default class Profile extends Backbone.Model<IProfile> {
  urlRoot = () => "http://localhost:3000/user";

  fetch(options?: ModelFetchOptions): JQueryXHR {
    return super.fetch({
      url: this.urlRoot(),
      ...options,
    });
  }

  validate(attrs?: IProfile) {
    if (attrs?.name && attrs.name.length < 3) {
      return "name is too short (minimum length is 3)";
    }

    return null;
  }

  sync(method: string, model: Profile, options: JQueryAjaxSettings): any {
    // Post data as FormData object on create to allow file upload
    if (method == "update") {
      var formData = new FormData();

      // Loop over model attributes and append to formData
      _.each(model.attributes, function (value, key) {
        formData.append(key, value);
      });

      // Set processData and contentType to false so data is sent as FormData
      _.defaults(options || (options = {}), {
        data: formData,
        processData: false,
        contentType: false,
      });
    }
    return Backbone.sync.call(this, method, model, options);
  }

  modifyProfil(
    attrs: ModifiableProfileArgs,
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
