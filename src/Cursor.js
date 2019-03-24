'use strict'

class Cursor extends Element {
    constructor() {
        super()
        this.center = new Point2D(0, 0);
        this.size = new Size2D(30, 30);
        this.snapSize = 0
        this.enable = true
        this.buildPath();
        this.enableDraw = false;
    }

    coordinates(...args) {
        return this.center(...args);
    }

    enable() {
        this.enable = true
    }

    disable() {
        this.enable = false
    }

    toggleEnable(){
        this.enable = !this.enable
    }

    snap(s) {
        if (s && typeof s == 'number') {
            this.snapSize = Math.abs(s);
        }
        return this.snapSize
    }

    buildPath() {
        this.path = new Path2D();
        this.path.rect(this.center.x() - this.size.x / 2, this.center.y() - this.size.y() / 2, this.size.x(), this.size.y());
    }

    draw(context, parentT) {
        if (this.enabledraw) {

            context.save();

            let ts = TransformationMatrix.multiply(parentT, this.transformation()).valueOf();

            context.setTransform(
                ts[0],
                ts[1],
                ts[2],
                ts[3],
                ts[4],
                ts[5]
            )

            context.strokeStyle = "black";
            context.fillStyle = "red";
            context.stroke(this.path)
            //ctx.fill(this.path)
            context.restore();
        }
    }

    snapToCoordinatesSystem(e, wtr) {
        if (this.snapSize && this.enable) {
            let p = wtr.clone().inv().multiplyPoint(e.x, e.y).valueOf()

            p[0] = Math.round(p[0] / this.snapSize) * this.snapSize
            p[1] = Math.round(p[1] / this.snapSize) * this.snapSize
            //console.log(p[0],p[1])
            let r = wtr.multiplyPoint(p[0], p[1]);
            e.snap_x = r[0]
            e.snap_y = r[1]
        } else {
            e.snap_x = e.x
            e.snap_y = e.y
        }
    }
}