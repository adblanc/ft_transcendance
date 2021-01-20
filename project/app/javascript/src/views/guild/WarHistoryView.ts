import Backbone from "backbone";
import Mustache from "mustache";
import Guild from "src/models/Guild";
import BaseView from "src/lib/BaseView";
import Wars from "src/collections/Wars";
import NodeView from "./NodeView";

type Options = Backbone.ViewOptions & { guild: Guild };

export default class WarHistoryView extends BaseView {
  guild: Guild;
  collection: Wars;

  constructor(options?: Options) {
    super(options);

	this.guild = options.guild;
	this.collection = this.guild.get("wars");

    this.guild.fetch({
      error: () => {
        Backbone.history.navigate("/not-found", { trigger: true });
      },
    });

    this.listenTo(this.guild, "change", this.render);
  }

  render() {
    const template = $("#warHistoryTemplate").html();
    const html = Mustache.render(template, this.guild.toJSON());
	this.$el.html(html);
	
	const $element = this.$("#listing");

	if (this.collection.isEmpty() || (this.collection.length == 1 && this.guild.get("pendingWar"))) {
		this.$("#no-war").show();
	}

    this.collection.forEach(function (item) {
	  if (item.get("status") != "pending") {
		var nodeView = new NodeView({
			model: item,
			guild: this.guild,
		});
		$element.append(nodeView.render().el);
	  }
    }, this);

    return this;
  }
}
