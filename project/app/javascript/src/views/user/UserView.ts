import Backbone from "backbone";
import Mustache from "mustache";
import moment from "moment";
import User from "src/models/User";
import BaseView from "src/lib/BaseView";

type Options = Backbone.ViewOptions & { userId: number };

export default class UserView extends BaseView {
  user: User;

  constructor(options: Options) {
    super(options);

    this.user = new User({ id: options.userId });
    this.user.fetch({ error: this.onFetchError });
    //marche po
    this.listenTo(this.user, "change", this.render);
  }

  onFetchError() {
    Backbone.history.navigate("/not-found", { trigger: true });
  }

  render() {
    const template = $("#userPageTemplate").html();
    const html = Mustache.render(template, {
      ...this.user.toJSON(),
      created_at: moment(this.user.get("created_at"))?.format("MM/DD/YYYY"),
      has_guild: !!this.user.get("guild"),
    });
    this.$el.html(html);

    return this;
  }
}
