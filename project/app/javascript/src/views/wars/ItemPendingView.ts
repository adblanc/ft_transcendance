import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import War from "src/models/War";
import NegotiateView from "./NegotiateView";

type Options = Backbone.ViewOptions & { model: War};

export default class ItemPendingView extends BaseView {
  model: War;
  opponent_id: number;
  index: number;

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
	const html = Mustache.render(template,  
		/*img: this.model.get("img"),
		url: `/guild/${this.opponent_id}`,
		name: this.model.get("guilds").at(this.index).get("name")*/
		this.model.toJSON(),
	);
	this.$el.html(html);
	

    return this;
  }
}