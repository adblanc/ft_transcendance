import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import War from "src/models/War";
import NegotiateView from "./NegotiateView";

type Options = Backbone.ViewOptions & { model: War };

export default class ItemPendingView extends BaseView {
  model: War;

  constructor(options?: Options) {
    super(options);

	this.model = options.model;
	this.listenTo(this.model, "change", this.render);
  }

  events() {
    return {
      "click #see-btn": "onSeeClicked",
    };
  }

  onSeeClicked() {
	const negotiateView = new NegotiateView({
		model: this.model,
	  });
  
	  negotiateView.render();
  }


  render() {
    const template = $("#pendingWarTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
	this.$el.html(html);
	

    return this;
  }
}