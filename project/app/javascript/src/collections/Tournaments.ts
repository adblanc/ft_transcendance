import Backbone from "backbone";
import Tournament from "src/models/Tournament";
import { BASE_ROOT } from "src/constants";

export default class Tournaments extends Backbone.Collection<Tournament> {
  constructor() {
	super();
	this.model = Tournament;
	this.url = `${BASE_ROOT}/tournaments`;

	this.comparator = function(model) {
		return model.get('registration_start');
	}
}
}