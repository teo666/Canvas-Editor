'use strict'

class Line extends Element{
    constructor(p1,p2,p3,p4){
        super();
        this.path = null;
        this.buildPath(p1,p2,p3,p4);

    }

    buildPath(p1,p2,p3,p4){
        
        this.path = new Path2D();

        this.path.moveTo(p1,p2);
        this.path.lineTo(p3,p4)
        this.path.closePath();
    }

    hitTest(x,y,tr){
        /** 
         * questa cosa mi permette di evitare id moltiplicare tutti i punti del path per la matrice di trasformazione
         * dell'elemento e moltiplicare invece solo il punto di cui voglio fare il test
        */
        /*let t = math.multiply( math.inv(math.multiply(tr,this.getTransformation)), [x,y,1]);
        ctx.save();
        ctx.setTransform(1,0,0,1,0,0);

        //ctx.stroke(this.path)
        let tx = math.subset(t, math.index(0) )
        let ty = math.subset(t, math.index(1) )
        let ret = ctx.isPointInPath(this.path, tx, ty)   
        ctx.restore();
        return ret; */
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

        ctx.strokeStyle = "black";
        ctx.stroke(this.path)
        ctx.restore();
    }

}