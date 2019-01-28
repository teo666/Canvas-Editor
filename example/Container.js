'use strict'

class Container extends Element{
    constructor(size){
        super();
        this.size = size;
    }

    draw(parentT){
        ctx.save();
        let ts = math.multiply(parentT, this.transformation);
        
        ctx.setTransform(
            math.subset(ts,math.index(0,0)),
            math.subset(ts,math.index(1,0)),
            math.subset(ts,math.index(0,1)),
            math.subset(ts,math.index(1,1)),
            math.subset(ts,math.index(0,2)),
            math.subset(ts,math.index(1,2))
        )
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, this.size.x, this.size.y);
        ctx.restore();
        super.draw(parentT);
    }

    /* if u want to return always the container that contains hitted element*/
    hitTestssss(...args){
        let htl = [this];
        return htl.concat(super.hitTest(...arguments))
    }
}