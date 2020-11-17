import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import Guild from "src/models/Guild";

type Options = Backbone.ViewOptions & { guild: Backbone.Model };

export default class InfoView extends Backbone.View {
  guild: Backbone.Model;

  constructor(options?: Options) {
    super(options);

    this.guild = options.guild;

    this.listenTo(this.guild, "change", this.render);
  }

  render() {
    const template = $("#infoTemplate").html();
    const html = Mustache.render(template, this.guild.toJSON());
    this.$el.html(html);

    return this;
  }
}
