'use strict'

class Net extends Element {
    constructor() {
        super()
        this.start = new Point2D(0, 0);
        this.end = new Point2D(100, 0)
        this.lineWidth = 1;
        this.lineDash = [10,10];
        this.strokeStyle = '#ff0000'
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
                this.buildPath()
            } else {
                throw 'Invalid arguments'
            }
        }
        return this.lineWidth;
    }

    buildPath() {
        let r = this.lineWidth / 2;
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

        let ts = math.multiply(parentT, this.transformation);

        context.setTransform(
            math.subset(ts, math.index(0, 0)),
            math.subset(ts, math.index(1, 0)),
            math.subset(ts, math.index(0, 1)),
            math.subset(ts, math.index(1, 1)),
            math.subset(ts, math.index(0, 2)),
            math.subset(ts, math.index(1, 2))
        )

        context.strokeStyle = 'black';
        context.lineWidth = this.lineWidth
        context.fillStyle = this.fillStyle
        context.strokeStyle = this.strokeStyle
        context.setLineDash(this.lineDash);
        context.stroke(this.path)
        context.fill(this.path)
        context.restore();

    }

    mousemove() { }
    mousedown() { }
    mouseup() { }
}