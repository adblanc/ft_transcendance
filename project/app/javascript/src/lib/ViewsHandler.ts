import { eventBus } from "src/events/EventBus";
import ChatView from "src/views/Chat/ChatView";
import NavbarView from "src/views/NavbarView";
import NotificationsView from "src/views/NotificationsView";
import Notifications from "src/collections/Notifications";
import BaseView from "./BaseView";

class PagesHandler {
  private currentPage?: BaseView;
  private navbarView?: BaseView;
  private chatView?: BaseView;
  notificationsView?: BaseView;
  notifications: Notifications;

  constructor() {
    this.currentPage = undefined;
    this.navbarView = undefined;
	this.chatView = undefined;
	this.notificationsView = undefined;

	this.notifications = new Notifications();
	//this.notifications.fetch();
  }

  addNavbar() {
    this.removeNavbar();
    this.navbarView = new NavbarView({
		notifications: this.notifications,
	});

    $("body").prepend(this.navbarView.render().el);
  }

  removeNavbar() {
    if (this.navbarView) {
      this.navbarView.close();
      this.navbarView = undefined;
    }
  }

  isNavbarDislayed() {
    return !!this.navbarView;
  }

  setupChat() {
    if (!this.chatView) {
      this.chatView = new ChatView({
        className: "invisible",
      });

      this.chatView.render();

      eventBus.listenTo(eventBus, "chat:open", () => {
        this.chatView.$el.toggleClass("invisible");
      });
    }
  }

  setupNotif() {
    if (!this.notificationsView) {
      this.notificationsView = new NotificationsView({
		className: "invisible",
		notifications: this.notifications,
      });

      this.notificationsView.render();

      eventBus.listenTo(eventBus, "notifications:open", () => {
        this.notificationsView.$el.toggleClass("invisible");
      });
    }
  }

  showPage(page: BaseView, withNavbar = true, withChat = true, withNotif = true) {
	this.notifications.fetch();
    if (this.currentPage) {
      this.currentPage.close();
    }

    if (withNavbar && !this.isNavbarDislayed()) {
      this.addNavbar();
    } else if (!withNavbar) {
      this.removeNavbar();
    }

    this.currentPage = page;
    this.currentPage.render();

    $("#container").html(this.currentPage.el);

    if (withChat) {
      this.setupChat();
      $("#container").append(this.chatView.el);
	}
	
	if (withNotif) {
		this.setupNotif();
		$("#container").append(this.notificationsView.el);
	  }

  }
}

export const pagesHandler = new PagesHandler();
