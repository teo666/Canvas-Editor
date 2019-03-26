'use strict'

class Arc extends Element {
    constructor(...args) {
        super()
        this.path = null;
        this.lineWidth = 7;
        this.lineDash = [];
        this.strokeStyle = Colors.HTMLColor.red
        this.fillStyle = Colors.HTMLColor.red
        this.globalCompositeOperation = this.globalCompositeOperation
        this.lineCap = CanvasStyle.lineCap.Round
        this.lineJoin = CanvasStyle.lineJoin.Round
        this.shadowBlur = this.shadowBlur
        this.shadowColor = this.shadowColor
        this.radiusSize = 50;
        this.arcLength = 0;
        this.centerPoint = new Point2D(0, 0)
        this.angles = new Size2D(0, Math.PI / 2)
        this.anticlockwise = false
        if(args.length) this.buildPath()

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

    radius(...args) {
        if (args.length == 1 && typeof args[0] == 'number') {
            this.radiusSize = Math.abs(args[0])
            this.buildPath()
        }
        return this.radiusSize
    }

    center(...args) {
        if (args.length > 0) {
            this.centerPoint.value(...args)
            this.buildPath()
        }
        return this.centerPoint
    }

    rotation(...args){
        if (args.length > 0) {
            this.anticlockwise = args[0] && true
            this.buildPath()
        }
        return this.anticlockwise
    }

    buildPath() {
        this.path = new Path2D();
        this.path.arc(this.centerPoint.x(), this.centerPoint.y(), this.radiusSize, this.angles.x(), this.angles.y(), this.anticlockwise);
    }

    startAngle(...args) {
        if (args.length > 0) {
            this.angles.x(...args)
            this.buildPath()
        }
        return this.angles.x();
    }

    endAngle(...args) {
        if (args.length > 0) {
            this.angles.y(...args)
            this.buildPath()
        }
        return this.angles.y();
    }

    draw(contextes, parentT) {
        if (this.enableDraw) {
            contextes.data.save();

            let t = TransformationMatrix.multiply(parentT, this.transformation)
            let ts = t.valueOf()
            contextes.data.setTransform(
                ts[0],
                ts[1],
                ts[2],
                ts[3],
                ts[4],
                ts[5]
            )

            contextes.data.globalCompositeOperation = this.globalCompositeOperation
            contextes.data.strokeStyle = this.strokeStyle
            contextes.data.lineWidth = this.lineWidth
            contextes.data.lineCap = this.lineCap
            contextes.data.lineJoin = this.lineJoin
            contextes.data.setLineDash(this.lineDash)
            contextes.data.shadowBlur = this.shadowBlur
            contextes.data.shadowColor = this.shadowColor
            contextes.data.stroke(this.path)

            //DEBUG: draw hitTestPath
            /*
            context.strokeStyle = 'black'
            context.lineWidth = 1
            context.stroke(this.hitPath)
            */

            contextes.data.restore();
            super.draw(contextes, null, t)
        }

        if(this.enableEdit){
            drawConstructionLine(contextes)
        }
    }

    drawConstructionLine(contextes) {
       //TODO:
    }
}