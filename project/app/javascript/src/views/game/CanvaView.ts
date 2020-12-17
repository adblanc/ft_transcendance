import Backbone from "backbone";
import Mustache from "mustache";
import ModalView from "../ModalView";
import Rectangle from "src/models/Rectangle";
import Player from "src/models/Player";
import { displaySuccess } from "src/utils/toast";
import Profile from "src/models/Profile";
import { generateAcn } from "src/utils/acronym";
import Ball from "src/models/Ball";

// class Ball {
// 	x: number;
// 	y: number;
// 	radius = 3;
// 	velocity = 2;
// 	constructor(x = 0, y = 0){
// 		this.x = x;
// 		this.y = y;
// 	}
// };

var canvas = document.createElement("canvas");
var ctx = canvas.getContext('2d');
//var lastTime = new Date().getSeconds();
let lastTime = null;

export default class CanvaView extends ModalView<Rectangle> {
	constructor(options?: Backbone.ViewOptions<Rectangle>) {
		super(options);
	  }
		player: Player;
		ball: Ball;
		ai: Player;
		points: Number;
		//render() {
		//const template = $("#canvas").html();
    	//const html = Mustache.render(template, {});

		init(width, height, bg, player, points) {
			this.points = points;
			canvas.width = width;
		  canvas.height = height;
		  canvas.style.backgroundColor = bg;
		  canvas.id = "canvas-id";
		  document.body.appendChild(canvas);
		  //console.log(canvas);
		  //document.getElementById("#canvas").appendChild(canvas);
		 // canvas.addEventListener('mouse', update); 
		  var paddle = new Rectangle(0, 0, width, height);
		  paddle.render(ctx, 'rgb(2, 149, 212)');
		 this.player = player; 
		  this.ai = new Player(new Rectangle(0, canvas.height / 2 - 25, 15, 100));
		  this.ball =  new Ball(width /2 , height / 2, 5);
		  return canvas;
		}

		collide_player(player, ball)
    	{
			
        	if (player.paddle.x < ball.right() && (player.paddle.x + 15) > ball.left() && ball.y > player.paddle.y && ball.y < (player.paddle.y +  player.paddle.height)) 
			{
				//displaySuccess("Collision.");
				ball.velocity.x -= 1.05;
            //const len = ball.velocity.len;
            //ball.vel.y += player.vel.y * .2;
            //ball.vel.len = len;
        	}
		}	
		// collide_ai(player, ball)
    	// {
        // if (player.x < ball.y) 
		// 	{
        //     ball.x -= ball.velocity.x * 1.05;
        //     //const len = ball.velocity.len;
        //     //ball.vel.y += player.vel.y * .2;
        //     //ball.vel.len = len;
        // 	}
		// }

		draw()
    	{
        	//this.clear();
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			this.player.render(ctx, 'rgb(120, 80, 0)');
			this.ai.render(ctx, 'rgb(0, 80, 120)');
			this.ball.render(ctx, 'rgb(80,80,80)');
        	//this.drawRect(this.ball);
        	//this.players.forEach(player => this.drawRect(player));
        	//this.drawScore();
		}
		reset()
		{
			const b = this.ball;
        	b.velocity.x = 2;
        	b.velocity.y = 2;
        	b.x = canvas.width / 2;
        	b.y = canvas.height / 2;
		}

		update(dt): Number {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			document.querySelector('#computer-score').textContent = String(this.player.score);
			this.ball.update();
			this.player.update(dt);
			if (this.ball.left() < 0 || this.ball.right() > canvas.width)
			{
				this.player.add();
				document.querySelector('#computer-score').textContent = String(this.player.score);
				this.reset();
				if (this.player.score >= this.points)
				{
					document.body.removeChild(canvas);
					return this.player.score;
				}
			}
				
			this.collide_player(this.player, this.ball);
			//this.collide_ai(this.ai, this.ball);
			this.draw();
			//this.update();
			//window.requestAnimationFrame(this.update);
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
			window.requestAnimationFrame(this.callback);
		}

		 stop(i: Number)
  {
    const template = $("#game_win").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);
    document.querySelector('#computer-score').textContent = String(i);
    return this;
  }

		setDimensions() {
			var width = this.model.get('width') + 'px';
			var height = this.model.get('height') + 'px';
			this.$el.css({
				width: width,
				height: height
			})
		}

		setPosition()  {
			var position = this.model.get('position');
			this.$el.css({
				left: position.x,
				top: position.y
			});
		}

		setColor() {
			this.$el.css('background-color', this.model.get('color')) 
		}

		move() {
			this.$el.css('left', this.$el.position().left + 10)
		}

	};




  
// })();