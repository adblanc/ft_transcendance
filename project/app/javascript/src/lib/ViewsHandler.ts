import { eventBus } from "src/events/EventBus";
import ChatView from "src/views/Chat/ChatView";
import NavbarView from "src/views/NavbarView";
import BaseView from "./BaseView";

class PagesHandler {
  private currentPage?: BaseView;
  private navbarView?: BaseView;
  private chatView?: ChatView;

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

      console.log("we create chat view and render it");

      $("body").append(this.chatView.render().el);
    } else {
      this.chatView.hideChat();
    }
  }

  closeChat() {
    console.log("we close chat");
    this.chatView.close();
    this.chatView = undefined;
  }
}

export const pagesHandler = new PagesHandler();
