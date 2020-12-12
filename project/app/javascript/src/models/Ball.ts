import Backbone from "backbone";
import _ from "underscore";
import BaseModel from "src/lib/BaseModel";
import Rectangle from "./Rectangle";

export default class Ball extends Backbone.Model{ 
    paddle: Rectangle;
    x: number;
    y: number;
    velocity: number;
    radius: number;
    constructor(x, y, radius)
    {
        super(Option);
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocity = 20;
    }
    // defaults() {
    //     return {
    //     paddle: new Rectangle(485, 500 / 2 - 25, 15, 50),
    //       }
    // }
    render(ctx, scolor) {
        ctx.beginPath();
        ctx.fillStyle = scolor;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
    }

    update() {
        this.x += this.velocity;
        this.y += this.velocity;
    }
};