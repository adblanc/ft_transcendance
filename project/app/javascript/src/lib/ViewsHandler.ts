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
	eventBus.listenTo(eventBus, "notifications:open", () => {
        if (!this.notificationsView) {
			this.renderNotifications();
		  } else {
			this.notificationsView.close();
			this.notificationsView = undefined;
		  }
	});
  }

  renderNotifications() {
    this.notificationsView = new NotificationsView({
      notifications: this.notifications,
	});

    $("#container").append(this.notificationsView.render().el);

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
		//$("#container").append(this.notificationsView.el);
	  }

  }
}

export const pagesHandler = new PagesHandler();
