import Backbone from "backbone";
import _ from "underscore";
import Profile from "src/models/Profile";
import Profiles from "src/collections/Profiles";
import { mapServerErrors, syncWithFormData } from "src/utils";
import BaseModel from "src/lib/BaseModel";

interface IGuild {
  id: string;
  name: string;
  ang: string;
  points: number;
  atWar: boolean;
  img_url?: string;
  members: Profiles;
  pending_members: Profiles;
  created_at: string;
  updated_at: string;
}

type CreatableGuildArgs = Partial<Pick<IGuild, "name" | "ang" | "img_url">>;

export default class Guild extends BaseModel<IGuild> {
  preinitialize() {
    this.relations = [
      {
        type: Backbone.Many,
        key: "members",
        collectionType: Profiles,
        relatedModel: Profile,
      },
      {
        type: Backbone.Many,
        key: "pending_members",
        collectionType: Profiles,
        relatedModel: Profile,
      },
    ];
  }

  constructor(options?: any) {
    super(options);
  }

  defaults() {
    return {
      name: "",
      ang: "",
      points: 0,
      atWar: false,
      members: [],
    };
  }

  urlRoot = () => "http://localhost:3000/guilds";

  sync(method: string, model: Guild, options: JQueryAjaxSettings): any {
    return syncWithFormData(method, model, options);
  }

  createGuild(attrs: CreatableGuildArgs) {
    return this.asyncSave(attrs, { url: this.urlRoot() });
  }

  modifyGuild(attrs: CreatableGuildArgs) {
    return this.asyncSave(attrs, {
      url: `${this.urlRoot()}/${this.get("id")}`,
    });
  }

  quit() {
    return this.asyncSave(
      {},
      {
        url: `http://localhost:3000/guilds/${this.get("id")}/quit`,
      }
    );
  }

  manageMembers(
    method: string,
    user_id: string,
    error: (errors: string[]) => void,
    success: () => void
  ) {
    this.save(
      {
        user_id: user_id,
      },
      {
        url: `http://localhost:3000/guilds/${this.id}/${method}`,
        success: () => success(),
        error: (_, jqxhr) => {
          error(mapServerErrors(jqxhr?.responseJSON));
        },
      }
    );
  }

  join(error: (errors: string[]) => void, success: () => void) {
    this.save(
      {},
      {
        url: `http://localhost:3000/guilds/${this.id}/join`,
        success: () => success(),
        error: (_, jqxhr) => {
          error(mapServerErrors(jqxhr?.responseJSON));
        },
      }
    );
  }

  accept(
    user_id: string,
    error: (errors: string[]) => void,
    success: () => void
  ) {
    this.save(
      {
        user_id: user_id,
      },
      {
        url: `http://localhost:3000/guilds/${this.id}/accept`,
        success: () => success(),
        error: (_, jqxhr) => {
          error(mapServerErrors(jqxhr?.responseJSON));
        },
      }
    );
  }

  reject(
    user_id: string,
    error: (errors: string[]) => void,
    success: () => void
  ) {
    this.save(
      {
        user_id: user_id,
      },
      {
        url: `http://localhost:3000/guilds/${this.id}/reject`,
        success: () => success(),
        error: (_, jqxhr) => {
          error(mapServerErrors(jqxhr?.responseJSON));
        },
      }
    );
  }

  withdraw(error: (errors: string[]) => void, success: () => void) {
    this.save(
      {},
      {
        url: `http://localhost:3000/guilds/${this.id}/withdraw`,
        success: () => success(),
        error: (_, jqxhr) => {
          error(mapServerErrors(jqxhr?.responseJSON));
        },
      }
    );
  }
}
