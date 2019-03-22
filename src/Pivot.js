'use strict'

class Pivot {
    constructor() {
        this.centerPoint = new Point2D(0, 0)
        this.crossSize = 10
        this.lineWidth = 2
        this.dimension = new Size2D(10, 10)
        this.strokeStyle = Colors.HTMLColor.red
        this.enableDraw = false
        //this.buildPath()
    }

    center(...args) {
        return this.centerPoint.value(...args)
    }

    size(...args) {
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

    draw(contextes, e_tm) {
        if (this.enableDraw) {
            contextes.fg.save()
            //ritorna la posizione del punto relativamente al mondo
            let p = e_tm.multiplyPoint(this.x(), this.y()).valueOf()
            contextes.fg.setTransform(
                1,0,0,1,
                p[0],
                p[1]
            )
            contextes.fg.strokeStyle = this.strokeStyle;
            contextes.fg.lineCap = 'butt'
            contextes.fg.setLineDash([])
            contextes.fg.lineWidth = this.lineWidth;
            contextes.fg.stroke(Pivot.staticPath.pathV)
            contextes.fg.lineWidth = this.lineWidth;
            contextes.fg.stroke(Pivot.staticPath.pathH)
            contextes.fg.restore()
        }
    }
}

Object.defineProperty(Pivot, 'staticPath', {
    value: (function () {
        //vertical segment
        const pathV = new Path2D()
        pathV.moveTo(0, -5)
        pathV.lineTo(0, 5)
        //horizontal segment
        const pathH = new Path2D()
        pathH.moveTo(-5, 0)
        pathH.lineTo(5, 0)
        return { pathH: pathH, pathV: pathV }
    })()
})