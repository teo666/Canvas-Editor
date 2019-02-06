'use strict'

class Line extends Element{
    constructor(...args){
        super();
        this.path = null;
        if(args.length == 1 && args[0] instanceof Line){
            this.start = args[0].getStart;
            this.end = args[0].getEnd;
        } else if(args.length == 2 && args[0] instanceof Point2D && args[1] instanceof Point2D){
            this.start = new Point2D(args[0]);
            this.end = new Point2D(args[1])
        } else {
            throw "Invalid arguments"
        }
        this.buildPath(this.start.x, this.start.y, this.end.x, this.end.y);
    }

    clone(){
        return new Line(this)
    }

    get getStart(){
        return math.clone(this.start)
    }

    get getEnd(){
        return math.clone(this.end)
    }

    setStart(p){
        this.start.value(p)
        this.buildPath(this.start.x, this.start.y, this.end.x, this.end.y);
    }

    setEnd(p){
        this.end.value(p)
        this.buildPath(this.start.x, this.start.y, this.end.x, this.end.y);
    }

    buildPath(p1,p2,p3,p4){
        
        this.path = new Path2D();

        this.path.moveTo(p1,p2);
        this.path.lineTo(p3,p4)
        this.path.closePath();
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