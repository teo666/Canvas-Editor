'use strict'

class Container extends Element{
    constructor(){
        super();
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
        ctx.strokeRect(0, 0, 300, 300);
        ctx.restore();
        super.draw(parentT);
    }
}