import { eventBus } from "src/events/EventBus";
import ChatView from "src/views/Chat/ChatView";
import NavbarView from "src/views/NavbarView";
import BaseView from "./BaseView";

class PagesHandler {
  private currentPage?: BaseView;
  private navbarView?: BaseView;
  private chatView?: BaseView;

  constructor() {
    this.currentPage = undefined;
    this.navbarView = undefined;
    this.chatView = undefined;
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

  showPage(page: BaseView, withNavbar = true, withChat = true) {
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
  }
}

export const pagesHandler = new PagesHandler();
