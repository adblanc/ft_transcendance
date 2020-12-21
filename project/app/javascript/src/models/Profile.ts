import Backbone, { ModelFetchOptions } from "backbone";
import "backbone-associations";
import _ from "underscore";
import Guild from "src/models/Guild";
import Notifications from "src/collections/Notifications";
import Notification from "src/models/Notification";
import consumer from "channels/consumer";
import { syncWithFormData } from "src/utils";
import BaseModel from "src/lib/BaseModel";
import { BASE_ROOT } from "src/constants";

export interface IProfile {
  login: string;
  name: string;
  email: string;
  two_fact_auth: boolean;
  id?: number;
  avatar?: any;
  created_at?: string;
  updated_at?: string;
  guild_role?: "Owner" | "Officer" | "Member";
  pending_guild?: Guild;
  guild?: Guild;
  notifications?: Notifications;
}

type ModifiableProfileArgs = Partial<Pick<IProfile, "name" | "avatar" | "email" | "two_fact_auth">>;

export default class Profile extends BaseModel<IProfile> {
  channel: ActionCable.Channel;
  notifications: Notifications;

  preinitialize() {
    this.relations = [
      {
        type: Backbone.One,
        key: "guild",
        relatedModel: Guild,
      },
      {
        type: Backbone.One,
        key: "pending_guild",
        relatedModel: Guild,
      },
      {
        type: Backbone.Many,
        key: "notifications",
        collectionType: Notifications,
        relatedModel: Notification,
      },
    ];
  }

  initialize() {
    this.notifications = new Notifications();
    //this.channel = this.createConsumer();
  }

  defaults() {
    return {
      login: "",
      name: "",
	  email: "",
	  two_fact_auth: false,
      number: 0,
      guild_role: "none",
    };
  }

  urlRoot = () => `${BASE_ROOT}/user`;

  createNotificationsConsumer() {
    const user_id = this.get("id");
    return consumer.subscriptions.create(
      { channel: "NotificationsChannel", user_id: user_id },
      {
        connected: () => {
          //console.log("connected to", user_id);
        },
        received: (notification: Notification) => {
          //console.log("we received", notification);
          this.notifications.add(notification);
        },
      }
    );
  }

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

  sync(method: string, model: Profile, options: JQueryAjaxSettings) {
    return syncWithFormData(method, model, options);
  }

  modifyProfil(attrs: ModifiableProfileArgs) {
// 	console.log(attrs);
    return this.asyncSave(attrs, {
      url: this.urlRoot(),
    });
  }
}
