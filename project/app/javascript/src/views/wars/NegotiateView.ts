import Backbone from "backbone";
import Mustache from "mustache";
import ModalView from "../ModalView";
import War, { WAR_ACTION } from "src/models/War";
import { displaySuccess } from "src/utils";

export default class NegotiateView extends ModalView<War> {

  constructor(options?: Backbone.ViewOptions<War>) {
    super(options);

    this.listenTo(this.model, "change", this.render);
    this.listenTo(this.model, "add", this.render);

  }

  events() {
    return {
	  ...super.events(),
	  "click #negotiate": () => this.onModify,
      "click #accept": () => this.onAction("accept"),
      "click #reject": () => this.onAction("reject"),
    };
  }

  async onAction(action: WAR_ACTION) {
    const success = await this.model.manageAction(
      action,
    );

    if (success) {
      this.saved(action);
    }
  }

  saved(action: WAR_ACTION) {
    displaySuccess(
		`You have successfully ${action}ed the proposition of war.`
	);
    this.model.fetch();
    this.closeModal();
  }

  async onModify(e: JQuery.Event) {
    e.preventDefault();
    //do stuff to deal with existing dates
    /*const success = await this.model.modifyWar(attrs);

    if (success) {
      displaySuccess("You have successfully proposed new terms.");
      this.closeModal();
      this.model.fetch();
    }*/
  }

  render() {
    super.render();
    const template = $("#negoTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
    this.$content.html(html);

    return this;
  }
}
