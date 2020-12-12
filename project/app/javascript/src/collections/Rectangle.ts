import Backbone from "backbone";
import Rectangle from "src/models/Rectangle";

export default class Games extends Backbone.Collection<Rectangle> {
  constructor(options) {
	super(options);
	this.model = Rectangle;
	this.url = "/games";}
}