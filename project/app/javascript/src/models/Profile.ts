import Backbone, { ModelFetchOptions } from "backbone";
import _ from "underscore";
import Guild from "src/models/Guild";
import Notifications from "src/collections/Notifications";
import Notification, { INotification } from "src/models/Notification";
import consumer from "channels/consumer";
import {
  AppearanceData,
  clearAuthHeaders,
  createAppereanceConsumer,
  syncWithFormData,
} from "src/utils";
import BaseModel from "src/lib/BaseModel";
import { BASE_ROOT } from "src/constants";
import { eventBus } from "src/events/EventBus";

export interface IBlockedUser {
  login: string;
  avatar_url: string;
  id: number;
}

export interface IProfile {
  login: string;
  name?: string;
  email?: string;
  two_fact_auth?: boolean;
  id?: number;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
  guild_role?: "Owner" | "Officer" | "Member";
  appearing_on?: string;
  is_present?: boolean;
  pending_guild?: Guild;
  guild?: Guild;
  notifications?: Notifications;
  blocked_users?: IBlockedUser[];
}

type ModifiableProfileArgs = {
  name?: string;
  avatar: any;
};

export default class Profile extends BaseModel<IProfile> {
  channel: ActionCable.Channel;
  appearanceChannel: ActionCable.Channel;
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
    this.listenTo(eventBus, "appeareance", this.reactToAppearance);
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

  reactToAppearance = ({ event, user_id, appearing_on }: AppearanceData) => {
    console.log("profile react to appearance");
    if (user_id === this.get("id")) {
      this.set({
        is_present: event === "appear" ? true : false,
        appearing_on,
      });
    }
  };

  createNotificationsConsumer() {
    const user_id = this.get("id");
    return consumer.subscriptions.create(
      { channel: "NotificationsChannel", user_id: user_id },
      {
        connected: () => {
          //console.log("connected to", user_id);
        },
        received: (notification: INotification) => {
          this.checkDmCreationNotification(notification);
          this.notifications.add(notification);
        },
      }
    );
  }

  checkDmCreationNotification(notification: INotification) {
    if (!notification.ancient) {
      eventBus.trigger("chat:other-user-dm-creation");
    }
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
    return this.asyncSave(attrs, {
      url: this.urlRoot(),
    });
  }

  blockUser(id: number) {
    return this.asyncSave(
      {},
      {
        url: `${BASE_ROOT}/block/${id}`,
      }
    );
  }

  unBlockUser(id: number) {
    return this.asyncSave(
      {},
      {
        url: `${BASE_ROOT}/unblock/${id}`,
      }
    );
  }
}

let memoizedUser: Profile = undefined;

const fetchCurrentUser = () => {
  memoizedUser.fetch({
    success: () => {
      console.log("we successfully fetched current user", memoizedUser);
      memoizedUser.channel = memoizedUser.createNotificationsConsumer();
      memoizedUser.appearanceChannel = createAppereanceConsumer();
    },
  });
};

export const currentUser = (fetch = false): Profile => {
  if (!memoizedUser) {
    memoizedUser = new Profile();
    fetchCurrentUser();
  } else if (fetch) {
    fetchCurrentUser();
  }

  return memoizedUser;
};

export const logoutUser = () => {
  console.log("logout user");
  clearAuthHeaders();
  consumer.disconnect();
  memoizedUser?.off("appearance");
  memoizedUser = undefined;
};
