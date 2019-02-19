'use strict'

class Cursor extends Element {
    constructor() {
        super()
        this.center = new Point2D(0, 0);
        this.size = new Size2D(30, 30);
        this.snap = 30
        this.buildPath();
        this.enabledraw = false;
    }

    get coordinates() {
        return this.center;
    }

    buildPath() {
        this.path = new Path2D();
        this.path.rect(this.center.x() - this.size.x / 2, this.center.y() - this.size.y / 2, this.size.x, this.size.y);
    }

    draw(context, parentT) {
        if (this.enabledraw) {

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
            ctx.fillStyle = "red";
            ctx.stroke(this.path)
            //ctx.fill(this.path)
            ctx.restore();
        }
    }

    mousemove(e) {
        let p = math.multiply(math.inv(e.parentTransformation), [e.x, e.y, 1]).valueOf();
        //console.log(p._data)
        this.center.x(math.round(p[0] / this.snap) * this.snap)
        this.center.y(math.round(p[1] / this.snap) * this.snap)
        //this.buildPath();
        //draw(ctx)
        //console.log(this.center.x(), this.center.y())
    }
}