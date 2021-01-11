import Backbone from "backbone";
import Mustache from "mustache";
import ModalView from "../ModalView";
import Rectangle from "src/models/Rectangle";
import Player from "src/models/Player";
import { displaySuccess } from "src/utils/toast";
import Profile from "src/models/Profile";
import { generateAcn } from "src/utils/acronym";
import Ball from "src/models/Ball";
import Mouvement from "src/models/Mouvement";

//var canvas = document.getElementById("canvas") as HTMLCanvasElement;
//var canvas = document.createElement("canvas");
//var ctx = canvas.getContext('2d');
let lastTime = null;

export default class CanvaView extends ModalView<Rectangle> {
	canvas: HTMLCanvasElement;
	player_one: Player;
	ball: Ball;
	player_two: Player;
	points: Number;
	level: Number;
	ctx: CanvasRenderingContext2d;
	game_id: number;
	constructor(options?: Backbone.ViewOptions<Rectangle>) {
		super(options);
		this.canvas = document.getElementById("canvas_yes") as HTMLCanvasElement;
	  }
		init(bg, player_one, points, level, player_two, game_id) {
		this.points = points;
		this.game_id = game_id;
		 if (level == "easy")
		 {this.level = 1;}
		 else if (level == "normal")
		 {this.level = 2;}
		 else if (level == "hard")
		 {this.level = 3;}
		 else
		 {
			 this.level = 1;
		 }
		 this.canvas = document.getElementById("canvas_yes") as HTMLCanvasElement;
		 this.ctx = this.canvas.getContext('2d');
		this.canvas.style.backgroundColor = '#DDD';
		 // var el_playing = document.getElementById("playing");
		 // displaySuccess(String(el_playing.id));
		  //el_playing.appendChild(this.canvas);
		  //document.getElementById("#canvas").appendChild(canvas);
		 // canvas.addEventListener('mouse', update); 
		  var paddle = new Rectangle(0, 0, this.canvas.width, this.canvas.height);
		  paddle.render(this.ctx, 'rgb(0, 150, 150)'); // C EST LA LA COULEUR
		 this.player_one = player_one; 
		 this.player_two = player_two;
		  this.ball =  new Ball(this.canvas.width /2 , this.canvas.height / 2, 5, this.level * 5);
		  this.draw();
		  return this.canvas;
		}

		collide_player_one(player_one)
    	{
			
        	if (player_one.paddle.x < this.ball.right() && (player_one.paddle.x + 15) > this.ball.left() && this.ball.y > player_one.paddle.y && this.ball.y < (player_one.paddle.y +  player_one.paddle.height)) 
			{
				this.ball.velocity.x *= -1.05;
        	}
		}	
		collide_player_two(player_two)
    	{
			
			if (this.ball.left() < (this.player_two.paddle.x + 15) && player_two.paddle.x < this.ball.right() && this.ball.y > player_two.paddle.y && this.ball.y < (player_two.paddle.y +  player_two.paddle.height))  
			{
            	this.ball.velocity.x *= -1.05;
        	}
		}

		draw()
    	{
        	//this.clear();
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.player_one.render(this.ctx, 'rgb(120, 80, 0)');
			this.player_two.render(this.ctx, 'rgb(0, 80, 120)');
			this.ball.render(this.ctx, 'rgb(80,80,80)');
        	//this.drawRect(this.ball);
        	//this.drawScore();
		}
		reset()
		{
			const b = this.ball;
        	b.velocity.x = 4;
        	b.velocity.y = 4;
        	b.x = this.canvas.width / 2;
        	b.y = this.canvas.height / 2;
		}

		update(dt): Number {
			//this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			//document.querySelector('#computer-score').textContent = String(this.player_one.score);
			//document.querySelector('#player-score').textContent = String(this.player_two.score);
			//this.ball.update();
			this.player_one.update(dt);
			if (this.ball.left() < 0)
			{
				this.player_one.add();
				const mouvement = new Mouvement({
					score_one: this.player_one.score,
					score_two: this.player_two.score,
					game_id: this.game_id,
					scale: 0,
					});
				const success = mouvement.save();
				//document.querySelector('#computer-score').textContent = String(this.player_one.score);
				this.reset();
			}
			else if (this.ball.right() > this.canvas.width)
			{
				this.player_two.add();
				const mouvement = new Mouvement({
					score_one: this.player_one.score,
					score_two: this.player_two.score,
					game_id: this.game_id,
					scale: 0,
					});
				const success = mouvement.save();
				//document.querySelector('#player-score').textContent = String(this.player_two.score);
				this.reset();
			}
			// if (this.player_one.score >= this.points)
			// 	{
			// 		//document.body.removeChild(canvas);
			// 		return 1;
			// 	}
			// else if (this.player_two.score >= this.points)
			// 	{
			// 		//document.body.removeChild(canvas);
			// 		return 2;
			// 	}
			if (this.ball.left() < this.player_two.paddle.x + 15 || this.ball.right() > this.player_one.paddle.x)
			{
				this.collide_player_one(this.player_one);
				this.collide_player_two(this.player_two);
			}
			//this.draw();
			return 0;
		}
		
		
		callback(millis: number): Number
		{
			if (lastTime)
			{
				const diff = millis - lastTime;
				var i = this.update(diff / 1000);
				return i;
			}
			lastTime = millis;
			//window.requestAnimationFrame(this.callback);
			return 0;
		}

		stop()
		{
			this.ball.velocity.x = 0;
			this.ball.velocity.y = 0;
			//document.body.removeChild(this.canvas);
		}

		 render()
		 {
		 	const template = $("#canvas").html();
		 	const html = Mustache.render(template, {});
		 	this.$el.html(html);
		 	return this;
		 }
// 		 stop(i: Number)
//   {
//     const template = $("#game_win").html();
//     const html = Mustache.render(template, {});
//     this.$el.html(html);
//     document.querySelector('#computer-score').textContent = String(i);
//     return this;
//   }
};