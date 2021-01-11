import Backbone from "backbone";
import Rectangle from "src/models/Rectangle";

export default class Rectangles extends Backbone.Collection<Rectangle> {
  constructor(options) {
	super(options);
	this.model = Rectangle;
	this.url = "/rectangle";}
}