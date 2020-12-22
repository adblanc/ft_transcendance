import Backbone from "backbone";
import Mustache from "mustache";
import Profile, { currentUser, logoutUser } from "../models/Profile";
import ProfileView from "./ProfileView";
import BaseView from "../lib/BaseView";
import { eventBus } from "src/events/EventBus";

export default class NavbarView extends BaseView {
  profile: Profile;
  profileView: Backbone.View;

  constructor(options?: Backbone.ViewOptions) {
    super(options);

    this.profile = currentUser();

    this.profileView = new ProfileView({
      model: this.profile,
    });

    this.listenTo(
      this.profile.notifications,
      "add",
      this.renderNotificationNumber
    );
    this.listenTo(
      this.profile.notifications,
      "change",
      this.renderNotificationNumber
    );
    this.listenTo(this.profile, "change:id", this.render);
  }

  events() {
    return {
      "click #btn-logout": "onLogout",
      "click #btn-notifications": "onClickNotification",
      "click #btn-messages": "onClickMessage",
      "click #navbar-brand": "onBrandClick",
    };
  }

  onBrandClick() {
    Backbone.history.navigate("/", { trigger: true });
  }

  onLogout() {
    eventBus.trigger("global:logout");
    logoutUser();
    Backbone.history.navigate("/auth", { trigger: true });
  }

  onClickMessage() {
    eventBus.trigger("chat:open");
  }

  onClickNotification(e: JQuery.Event) {
    e.stopPropagation();
    eventBus.trigger("notifications:open");
    this.profile.notifications.forEach(function (item) {
      if (!item.get("read_at")) {
        item.markAsRead();
      }
    });
  }

  renderNotificationNumber() {
    this.$("#notif-count").html(`${this.profile.notifications.getUnreadNb()}`);
  }

  render() {
    const template = $("#navbarTemplate").html();
    const html = Mustache.render(template, this.profile.toJSON());
    this.$el.html(html);

    this.renderNotificationNumber();

    this.renderNested(this.profileView, "#nav-profile");

    return this;
  }
}
