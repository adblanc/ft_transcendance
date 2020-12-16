import { BASE_ROOT } from "src/constants";
import BaseModel from "src/lib/BaseModel";
import _ from "underscore";

interface INotification {
  id: number;
  read_at: string;
  created_at: string;
  notifiable_type: string;
}

export default class Notification extends BaseModel<INotification> {
  url = () => `${BASE_ROOT}/notifications`;

  markAsRead() {
    this.save(
      {
        //'notification_id': this.get('id'),
      },
      {
        url: `${this.url()}/${this.get("id")}/mark_as_read`,
      }
    );
  }
}
