import Backbone from "backbone";
import _ from "underscore";
import BaseModel from "src/lib/BaseModel";
import Rectangle from "./Rectangle";
import { displaySuccess } from "src/utils/toast";

class Vec
{
    x: number;
    y: number;
    constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }
}

export default class Ball extends Backbone.Model{ 
    paddle: Rectangle;
    x: number;
    y: number;
    velocity: Vec;
    radius: number;
    constructor(x, y, radius, level)
    {
        super(Option);
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocity = new Vec(level,level);
        //this.velocity = new Vec(1,1);
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
        //if (this.top() <= 0 || this.bottom() > 250)
        if (this.top() <= 0 || this.bottom() >= 250)
        {
            this.velocity.y *= -1;    
        }
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
    left()
    {
        return this.x - this.radius;
    }
    right()
    {
        return this.x + this.radius;
    }
    top()
    {
        return this.y - this.radius;
    }
    bottom()
    {
        return this.y + this.radius;
    }
};