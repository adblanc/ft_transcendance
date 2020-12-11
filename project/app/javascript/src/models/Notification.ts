import BaseModel from "src/lib/BaseModel";
import _ from "underscore";

export default class Notification extends BaseModel {
  url = () => "http://localhost:3000/notifications";

  markAsRead() {
    this.save(
      {
        //'notification_id': this.get('id'),
      },
      {
        url: `http://localhost:3000/notifications/${this.id}/mark_as_read`,
      }
    );
  }
}
