'use strict'

class Cursor extends Element {
    constructor() {
        super()
        this.center = new Point2D(0, 0);
        this.size = new Size2D(30, 30);
        this.snapSize = 0
        this.buildPath();
        this.enabledraw = false;
    }

    get coordinates() {
        return this.center;
    }

    snap(s) {
        if (s && typeof s == 'number') {
            this.snapSize = math.abs(s);
        }
        return this.snapSize
    }

    buildPath() {
        this.path = new Path2D();
        this.path.rect(this.center.x() - this.size.x / 2, this.center.y() - this.size.y / 2, this.size.x, this.size.y);
    }

    draw(context, parentT) {
        if (this.enabledraw) {

            ctx.save();

            let ts = math.multiply(parentT, this.transformation).valueOf();

            context.setTransform(
                ts[0][0],
                ts[1][0],
                ts[0][1],
                ts[1][1],
                ts[0][2],
                ts[1][2]
            )

            ctx.strokeStyle = "black";
            ctx.fillStyle = "red";
            ctx.stroke(this.path)
            //ctx.fill(this.path)
            ctx.restore();
        }
    }

    snapToWorldCoordinates(e, wtr) {
        if (this.snapSize) {
            let p = math.multiply(math.inv(wtr), [e.detail.x, e.detail.y, 1]).valueOf();
            p[0] = math.round(p[0] / this.snapSize) * this.snapSize
            p[1] = math.round(p[1] / this.snapSize) * this.snapSize
            console.log(p[0],p[1])
            let r = math.multiply(wtr, [p[0], p[1], 1]).valueOf();
            e.detail.x = r[0]
            e.detail.y = r[1]
        }
    }
}