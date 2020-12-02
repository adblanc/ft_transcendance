import Mustache from "mustache";
import Backbone from "backbone";
import Game from "src/models/Game";
import Profile from "src/models/Profile";
import BaseView from "src/lib/BaseView";

export default class GameView extends BaseView {
  render() {
    const template = $("#game").html();
    const html = Mustache.render(template, {});
    jeu: Backbone.Model;
    user1: Backbone.Model;
    //var s1 = new String("<h1>" + jeu.user.getName() + "</h1>");

    const user1 = new Profile({ name: "Boby", login: "Marshell" });
    //nom: string;
    //const var nm: 'Bob';
    user1.set("name", "Bobard");
    //user1.sname("Bibou");
    var jeu = new Game({
      Id: 23,
      Type: "normal",
      Points: 4,
      Profile: new Profile({ name: "Moby", login: "Marshell" }),
    });
    jeu.set("user", user1);
    jeu.user.set("name", user1.get("name")); // seule chose qui fonctionne pour recup le jeu.user.name. L20 et L21 ne fonctionnent pas alors que le nom est bien set si on fait user1.name. Ccl: il faut set les choses 1 par 1
    var s = new String("<h2> Bonjour " + jeu.user.get("name") + "</h2>");
    s = s + jeu.gType;
    s = s + " </h2>";
    this.$el.html(html + s);

    // var jeu = new Game(23, 'normal', 4);
    // console.log(jeu.Type)
    return this;
  }
  events() {
    return {
      "click #game-enter": "loginGame",
    };
  }
  async loginGame(e: JQuery.Event)
  {
    //if (e.key === "click") {
    const input = this.$("#input-type").val();
      e.preventDefault();
      if (!input) {
        return;
      }
      else {
        return this.Gameview();
      }
  //}
}
  Gameview()
  {
    jeu: Backbone.Model;

    const type = this.$("#input-type").val();
    const points = this.$("#input-points").val();
    const level = this.$("#level").val();
    const one = this.$("#one") as unknown as HTMLInputElement;
    if (!one.checked) //ne fonctionne pas
       return this.oups();
    else {
    const template = $("#play").html();
    var jeu = new Game({
      Type: level,
      Points: +points,
      Profile: new Profile({ name: "Moby", login: "Marshell" }),
    });
    const html = Mustache.render(template, {});
    this.$el.html(html + jeu.get('Points') + jeu.get('Type'));
    return this;
  }
  }
  oups()
  {
    const oups = $("#oups").html();
    const html = Mustache.render(oups, {});
    this.$el.html(html);
    return this;
  }
}
