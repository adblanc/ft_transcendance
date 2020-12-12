import Backbone from "backbone";
import Mustache from "mustache";
import ModalView from "../ModalView";
import Rectangle from "src/models/Rectangle";
import Player from "src/models/Player";
import { displaySuccess } from "src/utils/toast";
import Profile from "src/models/Profile";
import { generateAcn } from "src/utils/acronym";
import Ball from "src/models/Ball";

// (function () {
  
//     $( "#header-plugin" ).load( "https://vivinantony.github.io/header-plugin/", function() {
// 	$("a.back-to-link").attr("href", "http://blog.thelittletechie.com/2015/02/make-backbonejs-to-draw-objects-on.html#tlt")  
// });
var canvas = document.createElement("canvas");
var ctx = canvas.getContext('2d');
var context;
var radius = 3;


export default class RectangleView extends ModalView<Rectangle> {
	constructor(options?: Backbone.ViewOptions<Rectangle>) {
		super(options);
	  }

	// events() {
	// 	return {
	// 		...super.events(),
	// 		"click #canvas": "move",
	// 	};
	// 	}
		// initialize() {
		// 	this.render();
		// }
		player: Player;
		ball: Ball;
		ai: Player;

		render() {
		const template = $("#canvas").html();
    	const html = Mustache.render(template, {});
		this.$el.html(html);
		this.init(500, 250, '#EEE');
		this.update();
		
		//  this.setDimensions();
		//  this.setPosition();
		//  this.setColor(); 
		return this;
		}
		init(width, height, bg) {
			canvas.width = width;
		  canvas.height = height;
		  canvas.style.backgroundColor = bg;
		  document.body.appendChild(canvas);
		  var paddle = new Rectangle(0, 0, width, height);
		  paddle.render(ctx, 'rgb(2, 149, 212)');
		  this.player = new Player(new Rectangle(485, canvas.height / 2 - 25, 15, 50));
		  //this.player.render(ctx, 'rgb(120, 80, 0)');
		  this.ai = new Player(new Rectangle(0, canvas.height / 2 - 25, 15, 50));
		  //this.ai.render(ctx, 'rgb(0, 80, 120)');
		  this.ball =  new Ball(width /2 , height / 2,10);
		  //this.ball.render(ctx, 'rgb(80,80,80)')
		}

		update() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			this.player.render(ctx, 'rgb(120, 80, 0)');
			this.ai.render(ctx, 'rgb(0, 80, 120)');
			this.ball.update();
			this.ball.render(ctx, 'rgb(80,80,80)');
			this.update();
			//window.requestAnimationFrame(this.update);
		}

		// Paddle.prototype.render() {
		// 	ctx.fillStyle = 'rgb(2, 149, 212)';
		// 	ctx.fillRect(this.x, this.y, this.width, this.height);
		// }






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