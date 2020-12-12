import Backbone from "backbone";
import Game from "src/models/Game";

export default class Games extends Backbone.Collection<Game> {
  constructor(options) {
	super(options);
	this.model = Game;
	this.url = "/games";}
}