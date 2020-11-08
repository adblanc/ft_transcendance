import Backbone from "backbone";

interface IProfile {
  login: string;
  name: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

type ModifiableProfileArgs = Partial<Pick<IProfile, "name" | "avatar_url">>;

export default class Profile extends Backbone.Model<IProfile> {
  urlRoot = () => "http://localhost:3000/user";

  validate(attrs?: IProfile) {
    if (attrs?.name && attrs.name.length < 3) {
      return "name is too short (minimum length is 3)";
    }

    return null;
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
