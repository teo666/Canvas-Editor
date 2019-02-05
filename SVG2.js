'use strict'

class SVG2 extends Element {
    constructor(args) {
        super();
        this.path = args;
        this.img = new Image()
        this.img.src = args;
    }

    hitTest(x, y, tr) {
        return false;
    }

    draw(parentT) {
        let t = math.multiply( parentT, this.getTransformation);
        
        ctx.save()

        ctx.setTransform(
            math.subset( t, math.index(0,0) ),
            math.subset( t, math.index(1,0) ),
            math.subset( t, math.index(0,1) ),
            math.subset( t, math.index(1,1) ),
            math.subset( t, math.index(0,2) ),
            math.subset( t, math.index(1,2) )
        )

        ctx.drawImage(
            this.img,
            0,
            0
        )

        ctx.restore()
    }

}