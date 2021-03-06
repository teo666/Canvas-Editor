'use strict'

class Net extends Element {
    constructor() {
        super()
        this.start = new Point2D(0, 0);
        this.end = new Point2D(100, 0)
        this.thicknessSize = 1;
        this.lineWidth = 1;
        this.lineDash = [];
        this.strokeStyle = '#000000'
        this.fillStyle = '#ff0000'
        this.buildPath();
    }

    setStart(x, y) {
        this.start.x(x)
        this.start.y(y)
        this.buildPath()
    }
    setEnd(x, y) {
        this.end.x(x)
        this.end.y(y)
        this.buildPath()
    }

    setPoints(sx, sy, ex, ey) {
        this.setStart(sx, sy)
        this.setEnd(ex, ey)
    }

    width(...args) {
        if (args.length == 1) {
            if (typeof args[0] == 'number') {
                this.lineWidth = args[0]
            } else {
                throw 'Invalid arguments'
            }
        }
        return this.lineWidth;
    }

    thickness(...args) {
        if (args.length == 1) {
            if (typeof args[0] == 'number') {
                this.thicknessSize = args[0]
                this.buildPath()
            } else {
                throw 'Invalid arguments'
            }
        }
        return this.thicknessSize;
    }

    buildPath() {
        let r = this.thicknessSize / 2;
        let dy = this.end.y() - this.start.y()
        let dx = this.end.x() - this.start.x()

        let alfa = -math.atan(dx / dy);
        if (dy < 0) {
            alfa += math.pi
        }
        //console.log(alfa * 180 / Math.PI)
        this.path = new Path2D();

        let diff = new Point2D(r * math.cos(alfa), r * math.sin(alfa))

        this.path.arc(this.start.x(), this.start.y(), r, math.pi + alfa, math.pi * 2 + alfa);
        this.path.lineTo(this.end.x() + diff.x(), this.end.y() + diff.y())
        this.path.arc(this.end.x(), this.end.y(), r, alfa, math.pi + alfa)
        this.path.closePath();
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

    hitTest(x, y, tr, context) {
        //console.log('hittest', arguments)
        let t = math.multiply(math.inv(math.multiply(tr, this.getTransformation)), [x, y, 1]).valueOf();
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);

        let ret = context.isPointInPath(this.path, t[0], t[1])
        context.restore();
        return ret;
    }

    mousemove() { }
    mousedown() { }
    mouseup() { }
}