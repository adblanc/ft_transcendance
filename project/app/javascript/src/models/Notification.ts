import Backbone from "backbone";
import _ from "underscore";
import Profile from "src/models/Profile";
import Profiles from "src/collections/Profiles";
import Guild from "./Guild";

//to be determined
var findPolyMorphicType = function (relation, attributes) {
    return Guild;
};

export default class Notification extends Backbone.AssociatedModel {
	preinitialize() {
		this.relations = [
			{
				type: Backbone.One,
      			key: "recipient",
      			relatedModel: Profile,
			},
			{
				type: Backbone.One,
      			key: "actor",
      			relatedModel: Profile,
			},
			{
				type: Backbone.One,
      			key: "notifiable",
      			relatedModel: Guild, //this is polymorphic so it will have to change
			}
		];
	}

  constructor(options?: any) {
	super(options);
  }

  urlRoot = () => "http://localhost:3000/notifications";

  sync(method: string, model: Notification, options: JQueryAjaxSettings): any {
    return Backbone.sync.call(this, method, model, options);
  }

}

