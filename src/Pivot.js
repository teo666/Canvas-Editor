'use strict'

class Pivot extends ControlElement{
    constructor() {
        super()
        this.centerPoint = new Point2D(0, 0)
        this.crossSize = 10
        this.lineWidth = 2
        this.dimension = new Size2D(10, 10)
        this.strokeStyle = Colors.HTMLColor.red
        this.enableDraw = false
        //this.buildPath()
    }

    value(...args){
        return this.center(...args)
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

    onMouseDown(editor, etype, e, p) {
        if (!this.DRAG) {
            p.setPermanentTarget(this)
            this.DRAG = true
            this.edit = true
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.MOUSEDOWN = {x,y,startx : this.centerPoint.x(), starty : this.centerPoint.y()}

            editor.cursor.snapToCoordinatesSystem(this.MOUSEDOWN, editor.world.getTransformation())
            const b = this.parentElement.getParentsTransformations().multiplyTM(this.parentElement.getTransformation()).inv().multiplyPoint(this.MOUSEDOWN.snap_x, this.MOUSEDOWN.snap_y)
            this.MOUSEDOWN.x = b[0]
            this.MOUSEDOWN.y = b[1]
        }

    }

    onMouseUp(editor, etype, e, p) {
        p.cancelPermanentTarget(this)
        this.DRAG = false
        this.MOUSEDOWN = {}

    }

    onMouseMove(editor, etype, e, p) {
        if (this.DRAG) {
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            let mmv = {
                x,y
            }

            editor.cursor.snapToCoordinatesSystem(mmv, editor.world.getTransformation())

            const a = this.parentElement.getParentsTransformations().multiplyTM(this.parentElement.getTransformation()).inv().multiplyPoint(mmv.snap_x, mmv.snap_y)
            mmv = {
                x: this.MOUSEDOWN.startx + a[0] - this.MOUSEDOWN.x,
                y: this.MOUSEDOWN.starty + a[1] - this.MOUSEDOWN.y
            }

            this.centerPoint.value(mmv.x, mmv.y)
            this.parentElement.buildPath()
            editor.draw()
            editor.clearForeground()
            editor.drawForeground()
        }
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
            if(this.parentElement){
                this.parentElement.edit(contextes)
            }
            this.addHitRegion(contextes, null, new TransformationMatrix().translate(p[0],p[1]))
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

Object.defineProperty(Pivot, 'staticHitPath', {
    value: (function () {
        const hit = new Path2D()
        hit.rect(-5,-5,10,10)
        return hit
    })()
})