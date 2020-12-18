import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import War from "src/models/War";
import NegotiateView from "./NegotiateView";

type Options = Backbone.ViewOptions & { model: War,  opponent_id: number };

export default class ItemPendingView extends BaseView {
  model: War;
  opponent_id: number;

  constructor(options?: Options) {
    super(options);

	this.opponent_id = options.opponent_id;
	this.model = options.model;
	this.model.fetch();
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
    const html = Mustache.render(template, {
		war: this.model.toJSON(),
		id: this.opponent_id
	});
	this.$el.html(html);
	

    return this;
  }
}