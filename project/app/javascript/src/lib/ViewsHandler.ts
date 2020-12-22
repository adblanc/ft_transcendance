import { eventBus } from "src/events/EventBus";
import ChatView from "src/views/Chat/ChatView";
import NavbarView from "src/views/NavbarView";
import NotificationsView from "src/views/NotificationsView";
import BaseView from "./BaseView";

class PagesHandler {
  private currentPage?: BaseView;
  private navbarView?: BaseView;
  private chatView?: ChatView;
  notificationsView?: BaseView;

  constructor() {
    this.currentPage = undefined;
    this.navbarView = undefined;
    this.chatView = undefined;
    this.notificationsView = undefined;
  }

  addNavbar() {
    this.removeNavbar();
    this.navbarView = new NavbarView();

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

  setupNotif() {
    if (!this.notificationsView) {
      this.notificationsView = new NotificationsView({
        className: "invisible",
      });

      this.notificationsView.render();

      eventBus.listenTo(eventBus, "notifications:open", () => {
        this.notificationsView.$el.toggleClass("invisible");
      });
    }
  }

  showPage(
    page: BaseView,
    withNavbar = true,
    withChat = true,
    withNotif = true
  ) {
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

    if (withNotif) {
      this.setupNotif();
      $("#container").append(this.notificationsView.el);
    }

    this.handleChat(withChat);
  }

  handleChat(withChat: boolean) {
    if (!withChat) {
      if (this.chatView) {
        return this.closeChat();
      }
      return;
    }

    if (!this.chatView) {
      this.chatView = new ChatView({
        className: "invisible",
      });

      $("body").append(this.chatView.render().el);
    } else {
      this.chatView.hideChat();
    }
  }

  closeChat() {
    this.chatView.close();
    this.chatView = undefined;
  }
}

export const pagesHandler = new PagesHandler();
