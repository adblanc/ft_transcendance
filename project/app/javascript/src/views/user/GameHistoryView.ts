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
import HistoryItemView from "./HistoryItemView";
import Game from "src/models/Game";
import Games from "src/collections/Games";

type Options = Backbone.ViewOptions & { games: Games };

export default class GameHistoryView extends BaseView {
  games: Games;

  constructor(options: Options) {
    super(options);

	this.games = options.games;

	console.log(this.games);
  
  }

  render() {
	const template = $("#gameHistoryTemplate").html();
	const html = Mustache.render(template, {});
    this.$el.html(html);

	const $element = this.$("#listing_game");

	console.log("test");

	//if finished
    this.games.forEach(function (item) {
		console.log("test");
      var historyItemView = new HistoryItemView({
        model: item,
      });
      $element.append(historyItemView.render().el);
    });

    return this;
  }

}
