'use strict'

class Container extends Element{
    constructor(size){
        super();
        this.size = size;
    }

    draw(context, parentT){
        context.save();
        let ts = TransformationMatrix.multiply(parentT, this.transformation).valueOf();
        
        context.setTransform(
            ts[0],
            ts[1],
            ts[2],
            ts[3],
            ts[4],
            ts[5]
        )
        context.lineWidth = 2;
        context.strokeRect(0, 0, this.size.x, this.size.y);
        context.restore();
        super.draw(context,parentT);
    }

    /* if u want to return always the container that contains hitted element*/
    /*
    hitTest(...args){
        let htl = [this];
        return htl.concat(super.hitTest(...arguments))
    }
    */
}