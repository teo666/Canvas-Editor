'use strict'

class Arc extends Element {
    constructor() {
        super()
        this.path = null;
        this.lineWidth = 7;
        this.lineDash = [];
        this.strokeStyle = '#000000';
        this.radiusSize = 50;
        this.arcLength = 0;
        this.centerPoint = new Point2D(0, 0)
        this.angles = new Size2D(0, Math.PI / 2)
        this.anticlockwise = false
        this.buildPath()

    }

    radius(...args) {
        if (args.length == 1 && typeof args[0] == 'number') {
            this.radiusSize = Math.abs(args[0])
        }
    }

    center(...args) {
        if (args.length > 0) {
            this.centerPoint.value(...args)
        }
        return this.centerPoint
    }

    buildPath() {
        this.path = new Path2D();
        this.path.arc(this.centerPoint.x(), this.centerPoint.y(), this.radiusSize, this.angles.x(), this.angles.y(), this.anticlockwise);
    }

    startAngle(...args){
        this.angles.x(...args)
        return this.angles.x();
    }

    endAngle(...args){
        this.angles.y(...args)
        return this.angles.y();
    }

    draw(context, parentT) {

        context.save();

        let ts = TransformationMatrix.multiply(parentT, this.transformation).valueOf()

        context.setTransform(
            ts[0],
            ts[1],
            ts[2],
            ts[3],
            ts[4],
            ts[5]
        )

        context.lineWidth = this.lineWidth
        context.strokeStyle = this.strokeStyle
        context.setLineDash(this.lineDash);
        context.stroke(this.path)
        context.restore();

    }
}