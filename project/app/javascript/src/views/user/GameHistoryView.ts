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
  count: number = 0;
  max: number = 1;

  constructor(options: Options) {
    super(options);

	this.games = options.games;

	console.log(this.games);
  
  }

  events() {
    return {
      'click #load-more-game': "LoadMoreGame",
    };
  }


  LoadMoreGame() {
    //var games = this.collection.models.slice(this.count, this.count + this.max);
    console.log("test_MORE");
    var games = this.games.models.slice(this.count, this.count + this.max);
	  if(games.length) {
			games.forEach(function (item) {
				console.log("test_MORE");
      var historyItemView = new HistoryItemView({
        model: item,
      });
      const $element = this.$("#listing_game");
      $element.append(historyItemView.render().el);
      this.count += 1; // UNdefined ???
			}, this);
	  } 
	  if (this.count == this.games.length) {
		  this.$("#load-more-game").hide();
	  }
  }

  render() {
	const template = $("#gameHistoryTemplate").html();
	const html = Mustache.render(template, {});
    this.$el.html(html);
	const $element = this.$("#listing_game");

  var games = this.games.first(this.max) //where({status: "finished"}) SEULEMENT LES FINIS 
    games.forEach(function (item) {
      var historyItemView = new HistoryItemView({
        model: item,
      });
      $element.append(historyItemView.render().el);
    });
    
    this.count += games.length;
    if (this.count == this.games.length) {
      console.log("count");
		  this.$("#load-more-game").hide();
	  }

    return this;
  }

}
