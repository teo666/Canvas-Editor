'use strict'

class Pivot {
    constructor() {
        this.center = new Point2D(30, 30)
        this.size = 10
        this.lineWidth = 1
        this.dimension = new Size2D(10, 10)
        this.enableDraw = true
        this.buildPath()
    }

    buildPath() {
        //vertical segment
        this.pathV = new Path2D()
        this.pathV.moveTo(this.center.x(), this.center.y() - this.dimension.y()/2)
        this.pathV.lineTo(this.center.x(), this.center.y() + this.dimension.y()/2)
        //horizontal segment
        this.pathH = new Path2D()
        this.pathH.moveTo(this.center.x() - this.dimension.x()/2, this.center.y())
        this.pathH.lineTo(this.center.x() + this.dimension.x()/2, this.center.y())
    }

    draw(context, e_tm) {
        if (this.enableDraw) {
            this.dimension.x(this.size / e_tm.scaleFactor.x)
            this.dimension.y(this.size / e_tm.scaleFactor.y)
            this.buildPath()
            context.strokeStyle = 'blue';
            context.lineCap = 'butt'
            context.setLineDash([])
            context.lineWidth = this.lineWidth/e_tm.scaleFactor.x;
            context.stroke(this.pathV)
            context.lineWidth = this.lineWidth/e_tm.scaleFactor.y;
            context.stroke(this.pathH)

        }
    }
}