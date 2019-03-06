'use strict'

class Pivot {
    constructor() {
        this.center = new Point2D(-25,-25)
        this.size = 10
        this.lineWidth = 1
        this.dimension = new Size2D(10, 10)
        this.enableDraw = true
        this.buildPath()
    }

    x(...args) {
        return this.center.x(...args)
    }

    y(...args) {
        return this.center.y(...args)
    }

    buildPath() {
        //vertical segment
        this.pathV = new Path2D()
        this.pathV.moveTo(this.center.x(), this.center.y() - this.dimension.y() / 2)
        this.pathV.lineTo(this.center.x(), this.center.y() + this.dimension.y() / 2)
        //horizontal segment
        this.pathH = new Path2D()
        this.pathH.moveTo(this.center.x() - this.dimension.x() / 2, this.center.y())
        this.pathH.lineTo(this.center.x() + this.dimension.x() / 2, this.center.y())
    }

    draw(el, context, e_tm, parentT) {
        if (this.enableDraw) {
            this.dimension.x(this.size / e_tm.scaleFactor.x)
            this.dimension.y(this.size / e_tm.scaleFactor.y)
            this.buildPath()

            //prendo il centro e guardo dove si trova rispetto all' elemento corrente
            //let pinv = e_tm.inv().multiplyPoint(this.x(), this.y())
            //let p = el.getTransformation().multiplyPoint(pinv[0],pinv[1])
            
            //console.log(p,pinv)



            context.strokeStyle = 'blue';
            context.lineCap = 'butt'
            context.setLineDash([])
            context.lineWidth = this.lineWidth / e_tm.scaleFactor.x;
            context.stroke(this.pathV)
            context.lineWidth = this.lineWidth / e_tm.scaleFactor.y;
            context.stroke(this.pathH)
            //context.restore()
        }
    }
}