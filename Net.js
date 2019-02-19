'use strict'

class Net extends Element {
    constructor() {
        super()
        this.start = new Point2D(0, 0);
        this.end = new Point2D(100, 0)
        this.width = 20
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

    setWidth(w) {
        this.width = w
    }

    buildPath() {
        let r = this.width / 2;
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
        if (!this.isPending) {

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

            context.strokeStyle = "black";
            context.fillStyle = "red";
            //ctx.stroke(this.path)
            context.fill(this.path)
            context.restore();
        }
    }

    mousemove() { }
    mousedown() { }
    mouseup() { }
}