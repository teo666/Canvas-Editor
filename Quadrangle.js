'use strict'

class Quadrangle extends Element {
    constructor() {
        super();
        this.path = null;
        this.lineWidth = 20;
        this.lineDash = [];
        this.strokeStyle = '#abcdef'
        this.fillStyle = 'yellowgreen'
        this.lineCap = CanvasStyle.lineCap.Round
        this.lineJoin = CanvasStyle.lineJoin.Round
        this.shadowColor = Colors.HTMLColor.red;
        this.globalCompositeOperation = CanvasStyle.globalCompositeOperation.source_over
        this.shadowBlur = 0;

        this.corners = [
            new Point2D(0, 0),
            new Point2D(0, 0),
            new Point2D(0, 0),
            new Point2D(0, 0)
        ]
        this.buildPath()
    }

    corner(...args) {
        if (args.length == 0) {
            return this.corners;
        }
        if (args.length == 1 && typeof args[0] == 'number' && args[0] > 0 && args[0] <= 4) {
            return this.corners[args[0] - 1]
        }
        if (args.length == 3 && typeof args[0] == 'number' && args[0] > 0 && args[0] <= 4 && typeof args[1] == 'number' && typeof args[2] == 'number') {
            this.corners[args[0] - 1].x(args[1])
            this.corners[args[0] - 1].y(args[2])
            this.buildPath()
            return this.corners[args[0] - 1]
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
        let t = TransformationMatrix.multiply(tr, this.getTransformation()).inv().multiplyPoint(x, y)
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);

        let ret = context.isPointInPath(this.path, t[0], t[1])
        context.restore();
        return ret;
    }

    draw(context, parentT) {
        if (this.enableDraw) {
            context.save();

            let t = TransformationMatrix.multiply(parentT, this.transformation)
            let ts = t.valueOf()

            context.setTransform(
                ts[0],
                ts[1],
                ts[2],
                ts[3],
                ts[4],
                ts[5]
            )

            context.globalCompositeOperation = this.globalCompositeOperation
            context.strokeStyle = this.strokeStyle
            context.lineWidth = this.lineWidth
            context.lineCap = this.lineCap
            context.lineJoin = this.lineJoin
            context.setLineDash(this.lineDash)
            context.shadowBlur = this.shadowBlur
            context.shadowColor = this.shadowColor
            context.fill(this.path)
            if(this.lineWidth){
                context.stroke(this.path)
            }

            if (this.selected) {
                this.pivot.draw(context, t)
            }
            context.restore();
            super.draw(context, null, t)
        }
    }
}