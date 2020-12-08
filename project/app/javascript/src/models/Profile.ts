import Backbone, { ModelFetchOptions } from "backbone";
import "backbone-associations";
import _ from "underscore";
import Guild from "src/models/Guild";
import Notifications from "src/collections/Notifications";
import Notification from "src/models/Notification";
import consumer from "channels/consumer";
import { mapServerErrors, syncWithFormData } from "src/utils";

interface IProfile {
  login: string;
  name: string;
  guild_role: string;
  id?: number;
  avatar?: any;
  created_at: string;
  updated_at: string;
}

type ModifiableProfileArgs = Partial<Pick<IProfile, "name" | "avatar">>;

export default class Profile extends Backbone.AssociatedModel {
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
      number: 0,
      guild_role: "none",
    };
  }

  urlRoot = () => "http://localhost:3000/user";

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
          this.notifications.add(
            new Notification({
              ...notification,
            })
          );
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
          error(mapServerErrors(jqxhr?.responseJSON));
        },
      }
    );

    if (!valid) {
      error([this.validationError]);
    }
  }
}
