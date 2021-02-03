import Mustache from "mustache";
import Backbone from "backbone";
import BaseView from "src/lib/BaseView";
import Tournament from "src/models/Tournament"
import CreateTournamentView from "./CreateTournamentView"
import TourListView from "./TourListView"
import Tournaments from "src/collections/Tournaments";
import { currentUser } from "src/models/Profile";

export default class TempTournamentView extends BaseView {
	collection: Tournaments;

  constructor(options?: Backbone.ViewOptions) {
	super(options);

	this.collection = new Tournaments();
	this.listenTo(this.collection, "add", this.render);
	this.listenTo(this.collection, "remove", this.render);
    this.listenTo(this.collection, "change", this.render);
    this.listenTo(this.collection, "sort", this.render);
    this.collection.fetch();
	this.collection.sort();

  }

  events() {
    return {
      "click #create-tour-btn": "onCreateClicked",
    };
  }

  onCreateClicked() {
    const tournament = new Tournament();
    const createTournamentView = new CreateTournamentView({
      model: tournament,
    });

    createTournamentView.render();
  }


  render() {
    const template = $("#tempTournamentTemplate").html();
    const html = Mustache.render(template, {
		admin: currentUser().get("admin") == true
	});
	this.$el.html(html);

	this.collection.slice(0, 5).forEach(function (item) {
		if (item.get("status") == "registration" || item.get("status") == "pending") {
			var tourListView = new TourListView({
			model: item,
			});
			if (item.get("status") == "registration")
				this.$("#list-open").append(tourListView.render().el);
			else 
				this.$("#list-upcoming").append(tourListView.render().el);
		}
	}, this);

    return this;
  }

}
