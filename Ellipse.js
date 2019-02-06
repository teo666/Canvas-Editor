'use strict'

class Ellipse extends Element{
    constructor(...args){
        super();
        this.path = null;    

        if(args.length == 2 && args[0] instanceof Point2D && args[1] instanceof Size2D){
            this.center = args[0].clone();
            this.size = args[1].clone()
            this.buildPath(args[0].x, args[0].y, args[1].w, args[1].h);
        } else {
            throw "Invalid arguments"
        }
    }

    get getCenter(){
        return this.center.clone();
    }

    get getCenterSHALLOW(){
        return this.center;
    }

    transformedCenter(){
        return new Point2D(math.multiply( this.transformation, this.center.point3).valueOf())
    }

    setCenter(c){
        this.center = c.clone();
    }
    
    buildPath(cx, cy, w, h){
        
        this.path = new Path2D();

        this.path.ellipse(cx, cy, w, h, 0, 0, 2 * Math.PI);
        this.path.closePath();
    }

    hitTest(x,y,tr){
        /** 
         * questa cosa mi permette di evitare id moltiplicare tutti i punti del path per la matrice di trasformazione
         * dell'elemento e moltiplicare invece solo il punto di cui voglio fare il test
        */
        let t = math.multiply( math.inv(math.multiply(tr,this.getTransformation)), [x,y,1]);
        ctx.save();
        ctx.setTransform(1,0,0,1,0,0);

        //ctx.stroke(this.path)
        let tx = math.subset(t, math.index(0) )
        let ty = math.subset(t, math.index(1) )
        let ret = ctx.isPointInPath(this.path, tx, ty)   
        ctx.restore();
        return ret; 
    }

    draw(parentT) {

        ctx.save();
        
        ctx.lineWidth = 0;
        ctx.strokeStyle = "black";
        ctx.fillStyle = "black";
        
        let ts = math.multiply(parentT, this.transformation);

        ctx.setTransform(
            math.subset(ts, math.index(0, 0)),
            math.subset(ts, math.index(1, 0)),
            math.subset(ts, math.index(0, 1)),
            math.subset(ts, math.index(1, 1)),
            math.subset(ts, math.index(0, 2)),
            math.subset(ts, math.index(1, 2))
        )

        ctx.fill(this.path);

        ctx.restore();
    }
}