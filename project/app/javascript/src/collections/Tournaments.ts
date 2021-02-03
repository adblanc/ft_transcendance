import Backbone from "backbone";
import Tournament from "src/models/Tournament";

export default class Tournaments extends Backbone.Collection<Tournament> {
  constructor() {
	super();
	this.model = Tournament;
	this.url = "/tournaments";

	this.comparator = function(model) {
		return model.get('registration_start');
	}
}
}