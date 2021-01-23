import Backbone from "backbone";
import Mustache from "mustache";
import ModalView from "../ModalView";
import Message from "src/models/Message";
import Game from "src/models/Game";

type Options = Backbone.ViewOptions<Game> & {
	room_id: number,
};

export default class ChatPlayView extends ModalView<Game> {
	room_id: number;
	level: string;
	goal: number;
	
  constructor(options?: Options) {
	super(options);
	
	this.room_id = options.room_id;
  }

  events() {
    return { ...super.events(), "click #input-chatplay-submit": "onSubmit" };
  }

  async onSubmit(e: JQuery.Event) {
	e.preventDefault();

	this.level = this.$("#level").val() as string;
	this.goal = this.$("#goal").val() as number;
	var game_type = "friendly";
	var warTimeId = null;
  
	const success = await this.model.challenge(
		this.level,
		this.goal,
		game_type,
		warTimeId,
	);
	if (success) {
		this.gameSaved();
	}
  }

  gameSaved() {
   	var content = `Let's play a game! Difficulty : ${this.level}. Points ${this.goal}`;
	const message = new Message({
		content,
		room_id: this.room_id,
	});

	return message.asyncSave();
  }


  render() {
    super.render();
    const template = $("#chatplayTemplate").html();
    const html = Mustache.render(template, {});
	this.$content.html(html);

	
    return this;
  }
}
