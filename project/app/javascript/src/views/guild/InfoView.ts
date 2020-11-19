import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "src/lib/BaseView";
import PageImgView from "./imgsViews/PageImgView";

type Options = Backbone.ViewOptions & { guild: Backbone.Model };

export default class InfoView extends BaseView {
  guild: Backbone.Model;
  imgView: Backbone.View;

  constructor(options?: Options) {
    super(options);

	this.guild = options.guild;
	this.imgView = new PageImgView({
		model: this.guild,
	});

    this.listenTo(this.guild, "change", this.render);
  }

  render() {
    const template = $("#infoTemplate").html();
    const html = Mustache.render(template, this.guild.toJSON());
	this.$el.html(html);
	
	this.renderNested(this.imgView, "#pageImg");

    return this;
  }
}
