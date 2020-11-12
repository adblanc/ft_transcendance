import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../BaseView";

export default class InfoView extends Backbone.View {
  render() {
    const template = $("#infoTemplate").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

    return this;
  }
} 
