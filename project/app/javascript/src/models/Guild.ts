import Backbone from "backbone";
import _ from "underscore";
import Profile from "src/models/Profile";
import Profiles from "src/collections/Profiles";
import GuildWar from "src/models/GuildWar";
import GuildWars from "src/collections/GuildWars";
import { syncWithFormData } from "src/utils";
import BaseModel from "src/lib/BaseModel";
import { BASE_ROOT } from "src/constants";

interface IGuild {
  id: string;
  name: string;
  ang: string;
  points: number;
  atWar: boolean;
  img_url?: string;
  members: Profiles;
  pending_members: Profiles;
  guild_wars: GuildWars;
  created_at: string;
  updated_at: string;
}

type CreatableGuildArgs = Partial<Pick<IGuild, "name" | "ang" | "img_url">>;

export type GUILD_ACTION = "promote" | "demote" | "fire" | "transfer";

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
	  {
        type: Backbone.Many,
        key: "guild_wars",
        collectionType: GuildWars,
        relatedModel: GuildWar,
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
	  guild_wars: [],
    };
  }

  urlRoot = () => `${BASE_ROOT}/guilds`;
  baseGuildRoot = () => `${this.urlRoot()}/${this.get("id")}`;

  sync(method: string, model: Guild, options: JQueryAjaxSettings): any {
    return syncWithFormData(method, model, options);
  }

  createGuild(attrs: CreatableGuildArgs) {
    return this.asyncSave(attrs, { url: this.urlRoot() });
  }

  modifyGuild(attrs: CreatableGuildArgs) {
    return this.asyncSave(attrs, {
      url: this.baseGuildRoot(),
    });
  }

  quit() {
    return this.asyncSave(
      {},
      {
        url: `${this.baseGuildRoot()}/quit`,
      }
    );
  }

  manageMembers(method: GUILD_ACTION, user_id: number) {
    return this.asyncSave(
      {
        user_id: user_id,
      },
      {
        url: `${this.baseGuildRoot()}/${method}`,
      }
    );
  }

  join() {
    return this.asyncSave(
      {},
      {
        url: `${this.baseGuildRoot()}/join`,
      }
    );
  }

  accept(user_id: number) {
    return this.asyncSave(
      { user_id: user_id },
      {
        url: `${this.baseGuildRoot()}/accept`,
      }
    );
  }

  reject(user_id: number) {
    return this.asyncSave(
      {
        user_id: user_id,
      },
      {
        url: `${this.baseGuildRoot()}/reject`,
      }
    );
  }

  withdraw() {
    return this.asyncSave(
      {},
      {
        url: `${this.baseGuildRoot()}/withdraw`,
      }
    );
  }
}
