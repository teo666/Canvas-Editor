'use strict'

class Pivot {
    constructor() {
        this.centerPoint = new Point2D(0,0)
        this.crossSize = 10
        this.lineWidth = 1
        this.dimension = new Size2D(10, 10)
        this.strokeStyle = Colors.HTMLColor.red
        this.enableDraw = true
        this.buildPath()
    }

    center(...args){
        return this.centerPoint.value(...args)
    }

    size(...args){
        return this.dimension.value(...args)
    }

    x(...args) {
        return this.centerPoint.x(...args)
    }

    y(...args) {
        return this.centerPoint.y(...args)
    }

    buildPath() {
        //vertical segment
        this.pathV = new Path2D()
        this.pathV.moveTo(this.centerPoint.x(), this.centerPoint.y() - this.dimension.y() / 2)
        this.pathV.lineTo(this.centerPoint.x(), this.centerPoint.y() + this.dimension.y() / 2)
        //horizontal segment
        this.pathH = new Path2D()
        this.pathH.moveTo(this.centerPoint.x() - this.dimension.x() / 2, this.centerPoint.y())
        this.pathH.lineTo(this.centerPoint.x() + this.dimension.x() / 2, this.centerPoint.y())
    }

    draw(context, e_tm, el) {
        if (this.enableDraw) {
            this.size(this.crossSize / e_tm.scaleFactor.x, this.crossSize / e_tm.scaleFactor.y)
            this.buildPath()

            context.save()
            //console.log(el.getTransformation().multiplyPoint(this.x(), this.y()))
            let inv = e_tm.clone().rotateOnPoint(-e_tm.rotationAngle, this.x(), this.y()).valueOf()
    
            context.setTransform(
                inv[0],
                inv[1],
                inv[2],
                inv[3],
                inv[4],
                inv[5]
            )

            context.strokeStyle = this.strokeStyle;
            context.lineCap = 'butt'
            context.setLineDash([])
            context.lineWidth = this.lineWidth / e_tm.scaleFactor.x;
            context.stroke(this.pathV)
            context.lineWidth = this.lineWidth / e_tm.scaleFactor.y;
            context.stroke(this.pathH)
            context.restore()
        }
    }
}