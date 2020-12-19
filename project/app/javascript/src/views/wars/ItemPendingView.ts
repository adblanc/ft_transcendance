import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import War from "src/models/War";
import NegotiateView from "./NegotiateView";

type Options = Backbone.ViewOptions & { model: War,  opponent_id: number };

export default class ItemPendingView extends BaseView {
  model: War;
  opponent_id: number;
  index: number;
  attrs: {};

  constructor(options?: Options) {
    super(options);

	this.opponent_id = options.opponent_id;
	this.model = options.model;
	this.model.fetch({
		success: () => {
			var tmp = 0;
			this.model.get("guilds").forEach(function (item) {
				if (item.get("id") == this.opponent_id) {
					this.index = tmp;
				}
				tmp++;
			}, this);

			this.attrs = {
				img: this.model.get("guilds").at(this.index).get("img_url"),
				url: `/guild/${this.opponent_id}`,
				name: this.model.get("guilds").at(this.index).get("name")
			}
		}
	})
	this.listenTo(this.model, "sync", this.render);

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
		attrs: this.attrs,
	});
	this.$el.html(html);
	

    return this;
  }
}