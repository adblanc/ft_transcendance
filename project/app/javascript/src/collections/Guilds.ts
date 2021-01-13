import Backbone from "backbone";
import { BASE_ROOT } from "src/constants";
import Guild from "src/models/Guild";

export default class Guilds extends Backbone.Collection<Guild> {
  constructor() {
    super();
    this.model = Guild;
    this.url = `${BASE_ROOT}/guilds`;

    this.comparator = function (model) {
      return -model.get("points");
    };
  }
}

//version js dans BoardView avant
/*var Collection = Backbone.Collection.extend({
		url: "/guilds",

		initialize: function(models, options) {
			options = options || {};
			models = new Guild();

			this.fetch({
				reset: true,
				success: console.log('SUCCESS'),
				error: console.log('ERROR'),
			});

			this.comparator = function(model) {
				return -model.get('points');
			}
		},
	});*/
