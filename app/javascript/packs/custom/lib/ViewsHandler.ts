import BaseView from "../views/BaseView";

class ViewsHandler {
  private currentView?: BaseView;

  showView(view: BaseView) {
    if (this.currentView) {
      this.currentView.close();
    }

    this.currentView = view;
    console.log("on render");
    this.currentView.render();

    console.log("on set container");

    $("#container").html(this.currentView.el);
  }
}

export const viewsHandler = new ViewsHandler();
