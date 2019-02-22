'use strict'

class Cursor extends Element {
    constructor() {
        super()
        this.center = new Point2D(0, 0);
        this.size = new Size2D(30, 30);
        this.snap = 2.54
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

    processCoordinates(e) {
        if(this.snap){
            e.detail.x = math.round(e.detail.x / this.snap) * this.snap
            e.detail.y = math.round(e.detail.y / this.snap) * this.snap
        }
    }
}