import NavbarView from "src/views/NavbarView";
import BaseView from "./BaseView";
import PageView from "./PageView";

class PagesHandler {
  private currentPage?: PageView;
  private navbarView?: BaseView;

  addNavbar() {
    this.removeNavbar();
    this.navbarView = new NavbarView();

    $("body").prepend(this.navbarView.render().el);
  }

  removeNavbar() {
    if (this.navbarView) {
      this.navbarView.close();
    }
  }

  isNavbarDislayed() {
    return !!this.navbarView;
  }

  showPage(page: PageView, withNavbar = true) {
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
  }
}

export const pagesHandler = new PagesHandler();
