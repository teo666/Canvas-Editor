'use strict'

class Bezier extends Element {
    constructor(...args) {
        super();
        this.value(...args)
        this.img = null;
    }

    value(...args){
        if(args.length == 4 &&
            args[0] instanceof Point2D &&
            args[1] instanceof Point2D &&
            args[2] instanceof Point2D &&
            args[3] instanceof Point2D){
            this.buildPath(args[0], args[1], args[2], args[3])
            }
    }

    buildPath(p1, p2, p3, p4) {
        //console.log("anche uqui")
        this.path = new Path2D();
        this.path.moveTo( p1.x , p1.y )

        this.path.bezierCurveTo( p2.x , p2.y, p3.x , p3.y , p4.x , p4.y );

    }

    hitTest(x, y, tr) {
        /** 
         * questa cosa mi permette di evitare id moltiplicare tutti i punti del path per la matrice di trasformazione
         * dell'elemento e moltiplicare invece solo il punto di cui voglio fare il test
        */
        let t = math.multiply(math.inv(math.multiply(tr, this.getTransformation)), [x, y, 1]);
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        //ctx.stroke(this.path)
        let tx = math.subset(t, math.index(0))
        let ty = math.subset(t, math.index(1))
        let ret = ctx.isPointInPath(this.path, tx, ty)
        ctx.restore();
        return ret;
    }



    draw(parentT) {

        ctx.save();

        let ts = math.multiply(parentT, this.transformation);

        ctx.setTransform(
            math.subset(ts, math.index(0, 0)),
            math.subset(ts, math.index(1, 0)),
            math.subset(ts, math.index(0, 1)),
            math.subset(ts, math.index(1, 1)),
            math.subset(ts, math.index(0, 2)),
            math.subset(ts, math.index(1, 2))
        )

        ctx.stroke(this.path)
        ctx.restore();
    }

}