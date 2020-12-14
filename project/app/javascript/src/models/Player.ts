import Backbone from "backbone";
import _ from "underscore";
import BaseModel from "src/lib/BaseModel";
import Rectangle from "./Rectangle";

export default class Player extends Backbone.Model{ 
    paddle: Rectangle;
    constructor(paddle: Rectangle)
    {
        super(Option);
        this.paddle = paddle;
    }
    // defaults() {
    //     return {
    //     paddle: new Rectangle(485, 500 / 2 - 25, 15, 50),
    //       }
    // }
    render(ctx, scolor) {
        this.paddle.render(ctx, scolor);
    }
};