import Backbone from "backbone";
import _ from "underscore";
import Profile from "src/models/Profile";
import Profiles from "src/collections/Profiles";
import Guild from "./Guild";

export default class Notification extends Backbone.Model {
	url = () => "http://localhost:3000/notifications";

	markAsRead() {
		this.save(
			{},
			{
			  url: "http://localhost:3000/notifications/mark_as_read"
			}
		  );
	  }
	
}