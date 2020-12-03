import Backbone, { ModelFetchOptions } from "backbone";
import "backbone-associations";
import _ from "underscore";
import Guild from "src/models/Guild";
import Notifications from "src/collections/Notifications";
import Notification from "src/models/Notification";
import consumer from "channels/consumer";

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
			}
		];
	}

	initialize() {
		this.notifications = new Notifications();
		this.channel = this.createConsumer();
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

  createConsumer() {
	//const user_id = this.get("user_id");
    return consumer.subscriptions.create(
      { channel: "NotificationsChannel", user: this },
      {
        connected: () => {
			//console.log(this.get("user_id"));
			//console.log(user_id);	
          //console.log("connected to", user_id);
        },
        received: (notification: Notification) => {
          console.log("we received", notification);
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

  asyncFetch(options?: Backbone.ModelFetchOptions): Promise<Profile> {
    return new Promise((res, rej) => {
      super.fetch({
        ...options,
        success: () => res(this),
        error: (_, jqxhr) => {
          rej(this.mapServerErrors(jqxhr.responseJSON));
        },
      });
    });
  }

  asyncSave(attrs?: any, options?: Backbone.ModelSaveOptions): Promise<Profile> {
    return new Promise((res, rej) => {
      super.save(attrs, {
        ...options,
        success: () => res(this),
        error: (_, jqxhr) => rej(this.mapServerErrors(jqxhr.responseJSON)),
      });
    });
  }

  mapServerErrors(errors: Record<string, string[]>) {
    return Object.keys(errors).map((key) => `${key} ${errors[key].join(",")}`);
  }
}
