import Backbone from "backbone";
import _ from "underscore";

export default class Notification extends Backbone.Model {
	url = () => "http://localhost:3000/notifications";

	markAsRead() {
		this.save(
			{
				//'notification_id': this.get('id'),
			},
			{
			  url: `http://localhost:3000/notifications/${this.id}/mark_as_read`
			}
		  );
	  }
	  
	
}