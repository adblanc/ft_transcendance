import NavbarView from "src/views/NavbarView";
import BaseView from "../views/BaseView";

class ViewsHandler {
  private currentView?: BaseView;
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

  showView(view: BaseView, withNavbar = true) {
    if (this.currentView) {
      this.currentView.close();
    }

    if (withNavbar && !this.isNavbarDislayed()) {
      this.addNavbar();
    } else if (!withNavbar) {
      this.removeNavbar();
    }

    this.currentView = view;
    this.currentView.render();

    $("#container").html(this.currentView.el);
  }
}

export const viewsHandler = new ViewsHandler();
