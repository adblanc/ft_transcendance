import Backbone from "backbone";
import Mustache from "mustache";
import ModalView from "../ModalView";
import Game from "src/models/Game";
import { displayToast } from "src/utils/toast";
import MainRouter from "src/routers/MainRouter";
import Profile from "src/models/Profile";

export default class CreateGameView extends ModalView<Game>
{
    //jeu: Game;
	id: string;
    i: number;
  constructor(i: number, options?: Backbone.ViewOptions<Game>) {
    super(options);
    this.i = i;
	//this.listenTo(this.model, "change", this.render);
	this.listenTo(this.model, "add", this.render);

	// this.collection.forEach(function(item) {
	// 	tmp.push(item.get('ang'));
	// });
//	this.list = tmp;
  }

  events() {
    return { ...super.events(), 
        "click #game-enter": "loginGame",
       // "click #create_game": "render",
    };
  }
  async loginGame(e: JQuery.Event)
  {
    //if (e.key === "click") {
    const input = this.$("#points").val();
      e.preventDefault();
      if (!input) {
        return;
      }
      else {
        jeu: Backbone.Model;
        const enemy = this.$("#input-enemy").val();
        points: Number;
        const points = this.$("#points").val();
        level: String;
        const level = this.$("#level").val();
        //const one = this.$("#one") as unknown as HTMLInputElement;
        // if (!one.checked) //ne fonctionne pas
        //    return this.oups();
        // else {
        this.id = this.i.toString();
        var jeu = new Game({
        //const attrs = {
        Id: this.i,
        Type: "BRAVO",
        Points: points,
        Profile: new Profile({ name: "Moby", login: "Marshell" }),
        url: 'http://localhost:3000/game/${id}',
        });
        this.i++;
        this.model = new Game({
            //const attrs = {
            Id: this.i,
            Type: level,
            Points: points,
            Profile: new Profile({ name: "Moby", login: "Marshell" }),
            url: 'http://localhost:3000/game/${id}',
            });
        this.model.createGame(jeu, () => this.gameSaved());
      }
    }
      gameSaved() {
        s: String;
       var s =  "Game successfully created." + this.model.Type;
        displayToast({ text: s }, "success");
        this.closeModal();
        this.model.fetch();
        const router = new MainRouter();
        router.navigate(`game/${this.id}`, { trigger: true });
       // return this.play(s); 
      }

    //   play(s: string)
    //   {
    //     const template = $("#playGame").html();
    //     const html = Mustache.render(template, this.model.toJSON());
    //     this.$content.html(html + s);
    //     return this;
    //   }

      render()
      {
        super.render(); // we render the modal
        const template = $("#gameFormTemplate").html();
        const html = Mustache.render(template, this.model.toJSON());
        this.$content.html(html);
        return this;
      }
    }