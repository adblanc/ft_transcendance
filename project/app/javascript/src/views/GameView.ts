import Mustache from "mustache";
import Backbone from "backbone";
import PageView from "src/lib/PageView";
import Game from "src/models/Game";
import Profile from "src/models/Profile";

export default class GameView extends PageView {
    render() {
      const template = $("#game").html();
      const html = Mustache.render(template, {});
      jeu: Backbone.Model;
      user1: Backbone.Model;
      //var s1 = new String("<h1>" + jeu.user.getName() + "</h1>");
      
      const user1 = new Profile({name: "Boby", login: "Marshell"});
      //nom: string;
      //const var nm: 'Bob';
      user1.set("name", "Bobard");
      //user1.sname("Bibou");
      var jeu = new Game({Id: 23, Type: "normal", Points: 4, Profile: new Profile({name: "Moby", login: "Marshell"})});
      jeu.set("user", user1);
      jeu.user.set("name", user1.get("name")); // seule chose qui fonctionne pour recup le jeu.user.name. L20 et L21 ne fonctionnent pas alors que le nom est bien set si on fait user1.name. Ccl: il faut set les choses 1 par 1
      var s = new String("<h2> Bonjour " + jeu.user.get("name")+ "</h2>");
      s = s + jeu.gType;
      s = s + " </h2>";
      this.$el.html(html + s);

     // var jeu = new Game(23, 'normal', 4);
     // console.log(jeu.Type)
      return this;
    }
  }