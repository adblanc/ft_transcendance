import { eventBus } from "src/events/EventBus";
import ChatView from "src/views/Chat/ChatView";
import NavbarView from "src/views/NavbarView";
import NotificationsView from "src/views/NotificationsView";
import Notifications from "src/collections/Notifications";
import BaseView from "./BaseView";
import Profile from "src/models/Profile";

class PagesHandler {
  private currentPage?: BaseView;
  private navbarView?: BaseView;
  private chatView?: BaseView;
  notificationsView?: BaseView;
  profile: Profile;

  constructor() {
    this.currentPage = undefined;
    this.navbarView = undefined;
	this.chatView = undefined;
	this.notificationsView = undefined;
	this.profile = undefined;

	//this.notifications.fetch();
  }

  addNavbar() {
    this.removeNavbar();
    this.navbarView = new NavbarView({
		profile: this.profile,
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
		profile: this.profile,
      });

      this.notificationsView.render();

      eventBus.listenTo(eventBus, "notifications:open", () => {
        this.notificationsView.$el.toggleClass("invisible");
      });
    }
  }

  showPage(page: BaseView, withNavbar = true, withChat = true, withNotif = true) {
	
	const token = localStorage.getItem("tokenAuth");
	if (token)
	{
		this.profile = new Profile();
		this.profile.fetch({
		success: () => {
			this.profile.channel = this.profile.createConsumer();
		},
		});

	}

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