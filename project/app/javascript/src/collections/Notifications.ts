import Backbone from "backbone";
import Notification from "src/models/Notification";

export default class Notifications extends Backbone.Collection<Notification> {
	constructor() {
	  super();
  
	  this.model = Notification;
	}
  }
  