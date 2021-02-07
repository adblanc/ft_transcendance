import Backbone from "backbone";
import Mustache from "mustache";
import moment from "moment";
import User from "src/models/User";
import BaseView from "src/lib/BaseView";
import RequestsView from "./RequestsView";
import FriendsView from "./FriendsView";
import { eventBus } from "src/events/EventBus";
import { currentUser } from "src/models/Profile";
import { displaySuccess } from "src/utils";
import { BASE_ROOT } from "src/constants";
import axios from "axios";
import TrophyView from "./TrophyView";
import Tournaments from "src/collections/Tournaments";

type Options = Backbone.ViewOptions & { tournaments: Tournaments };

export default class TrophiesView extends BaseView {
  tournaments: Tournaments;

  constructor(options: Options) {
    super(options);

	this.tournaments = options.tournaments;
  
  }

  render() {
	const template = $("#trophiesTemplate").html();
	const html = Mustache.render(template, {});
    this.$el.html(html);
	const $element = this.$("#listing");

    this.tournaments.forEach(function (item) {
      var trophyView = new TrophyView({
        model: item,
      });
      $element.append(trophyView.render().el);
    });
    
    return this;
  }

}
