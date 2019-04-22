'use strict'

class Handle extends ControlElement {
    constructor(point) {
        super()
        //TODO: introdurre il concetto di tipo delle maniglie
        this.shape = Handle.shape.round
        this.type = null
        this.position = point
        this.enableDraw = false
        this.parentElement = null
        this.edit = false
        this.snapEnabled = true
        this.strokeStyle = Colors.HTMLColor.black
        this.lineWidth = 1
    }

    getPath() {
        switch (this.shape) {
            case 0:
                return Handle.staticPathRound
            case 1:
                return Handle.staticPathSquare
            case 2:
                return Handle.staticPathCross
        }
    }

    onMouseDown(editor, etype, e, p) {
        if (!this.DRAG) {
            p.setPermanentTarget(this)
            this.DRAG = true
            this.edit = true
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.MOUSEDOWN = { x, y, startx: this.position.x(), starty: this.position.y() }

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
                x, y, snap_x: x, snap_y: y
            }

            if (this.snapEnabled) {
                editor.cursor.snapToCoordinatesSystem(mmv, editor.world.getTransformation())
            }
            
            const a = this.parentElement.getParentsTransformations().multiplyTM(this.parentElement.getTransformation()).inv().multiplyPoint(mmv.snap_x, mmv.snap_y)
            mmv = {
                x: this.MOUSEDOWN.startx + a[0] - this.MOUSEDOWN.x,
                y: this.MOUSEDOWN.starty + a[1] - this.MOUSEDOWN.y
            }

            this.position.value(mmv.x, mmv.y)
            this.postChange()
            this.parentElement.buildPath()
            editor.draw()
            editor.clearForeground()
            this.parentElement.edit(editor.contextes)
            editor.drawForeground()
        }
    }

    draw(contextes, pT) {
        if (this.enableDraw) {

            let ctx = contextes.fg
            let p = pT.multiplyPoint(this.position.x(), this.position.y()).valueOf()

            ctx.save();

            ctx.setTransform(
                1, 0, 0, 1,
                p[0],
                p[1]
            )
            ctx.fillStyle = 'white'

            ctx.strokeStyle = this.strokeStyle
            let s = this.getPath()

            ctx.stroke(s)
            ctx.fill(s)
            //ctx.fill(Handle.staticPathRound)
            //ctx.drawImage(Handle.source, - Handle.source.width / 2, - Handle.source.height / 2)


            ctx.restore();
            this.addHitRegion(contextes, null, new TransformationMatrix().translate(p[0], p[1]))
        }
    }
}

Object.defineProperty(Handle, 'source', {
    value: (function () {
        const i = new Image()
        i.src = '../img/handle2.png'
        return i
    })()
})

Object.defineProperty(Handle, 'staticPathRound', {
    value: (function () {
        const i = new Path2D()
        i.arc(0, 0, 5, 0, Math.PI * 2)
        return i
    })()
})

Object.defineProperty(Handle, 'staticPathCross', {
    value: (function () {
        const i = new Path2D()
        i.moveTo(-5, -5)
        i.lineTo(5, 5)
        i.moveTo(5, -5)
        i.lineTo(-5, 5)
        return i
    })()
})

Object.defineProperty(Handle, 'staticPathSquare', {
    value: (function () {
        const i = new Path2D()
        i.rect(-5, -5, 10, 10)
        return i
    })()
})

Object.defineProperty(Handle, 'shape', {
    value: {
        'round': 0,
        'square': 1,
        'cross': 2
    }
})