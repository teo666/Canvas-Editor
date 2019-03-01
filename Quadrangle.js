'use strict'

class Quadrangle extends Element {
    constructor() {
        super();
        this.path = null;
        this.lineWidth = 1;
        this.lineDash = [];
        this.strokeStyle = '#faba11aa'
        this.fillStyle = '#00000000'

        this.corners = [new Point2D(0, 0),
                        new Point2D(0, 0),
                        new Point2D(0, 0),
                        new Point2D(0, 0)]
    }

    corner(...args){
        if(args.length == 0){
            return this.corners;
        }
        if(args.length == 1 && typeof args[0] == 'number' && args[0] > 0 && args[0] <= 4){
            return this.corners[args[0]-1]
        }
        if(args.length == 3 && typeof args[0] == 'number' && args[0] > 0 && args[0] <= 4 && typeof args[1] == 'number' && typeof args[2] == 'number' ){
            this.corners[args[0]-1].x(args[1])
            this.corners[args[0]-1].y(args[2])
            this.buildPath()
            return this.corners[args[0]-1]
        } else {
            throw "Invalid arguments"
        }
    }

    buildPath() {
        this.path = new Path2D()

        this.path.moveTo(this.corner(1).x(), this.corner(1).y())
        this.path.lineTo(this.corner(2).x(), this.corner(2).y())
        this.path.lineTo(this.corner(3).x(), this.corner(3).y())
        this.path.lineTo(this.corner(4).x(), this.corner(4).y())
        this.path.closePath()
    }

    hitTest(x, y, tr, context) {

        //console.log('hittest', arguments)
        let t = math.multiply(math.inv(math.multiply(tr, this.getTransformation)), [x, y, 1]).valueOf();
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);

        let ret = context.isPointInPath(this.path, t[0], t[1])
        context.restore();
        return ret;
    }

    draw(context, parentT) {
        context.save();

        let ts = math.multiply(parentT, this.transformation).valueOf();

        context.setTransform(
            ts[0][0],
            ts[1][0],
            ts[0][1],
            ts[1][1],
            ts[0][2],
            ts[1][2]
        )

        context.lineWidth = this.lineWidth
        context.fillStyle = this.fillStyle
        context.strokeStyle = this.strokeStyle
        context.setLineDash(this.lineDash);
        context.stroke(this.path)
        context.fill(this.path)
        context.restore();
    }
}