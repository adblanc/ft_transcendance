import Backbone from "backbone";
import Mustache from "mustache";
import Guild from "src/models/Guild";
import BaseView from "src/lib/BaseView";

type Options = Backbone.ViewOptions & { guild: Guild };

export default class WarHistoryView extends BaseView {
  guild: Guild;

  constructor(options?: Options) {
    super(options);

    this.guild = options.guild;

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

    return this;
  }
}
