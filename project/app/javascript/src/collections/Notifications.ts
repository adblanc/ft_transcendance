import Backbone from "backbone";
import Notification from "src/models/Notification";

export default class Notifications extends Backbone.Collection<Notification> {
	constructor() {
	  super();
  
	  this.model = Notification;
	}

	getUnreadNb() {
		var nb = 0;
		this.forEach(function (item) {
			if (!item.get("read_at")) {
				nb++;
			}
		});
		return nb;
  }
}