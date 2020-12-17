import Backbone from "backbone";
import _ from "underscore";
import BaseModel from "src/lib/BaseModel";
import Rectangle from "./Rectangle";

class Vec
{
    x: number;
    y: number;
    score: number;
    constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }

}

export default class Player extends Backbone.Model{ 
    paddle: Rectangle;
    vel: Vec;
    score: number;
    _lastPos: Vec;
    constructor(paddle: Rectangle)
    {
        super(Option);
        this.paddle = paddle;
        this.vel = new Vec;
        this.score = 0;
        this._lastPos = new Vec;
    }
    // defaults() {
    //     return {
    //     paddle: new Rectangle(485, 500 / 2 - 25, 15, 50),
    //       }
    // }
    render(ctx, scolor) {
        this.paddle.render(ctx, scolor);
    }
    update(dt)
    {
        this.vel.y = (this.paddle.y - this._lastPos.y) / dt;
        this._lastPos.y = this.paddle.y;
    }
    add()
    {
        this.score++;
    }
    score_reset()
    {
        this.score = 0;
    }
};