import Backbone from "backbone";
import _ from "underscore";
import BaseModel from "src/lib/BaseModel";

export default class Rectangle extends Backbone.Model{ 
    width: number;
    height: number;
    color: string;
    x: number;
    y: number;
    constructor(x, y, width, height)
    {
        super(Option);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        
    }
    defaults() {
        return {
        width: 400,
        height: 400,
		color: '#ff0000',
          }
    }
    render(ctx, scolor) {
            ctx.fillStyle = scolor;
            ctx.fillRect(this.x, this.y, this.width, this.height);
    }
};