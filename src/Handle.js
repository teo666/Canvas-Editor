'use strict'

class Handle extends ControlElement {
    constructor(point) {
        super()
        //TODO: introdurre il concetto di tipo delle maniglie
        this.type = null
        this.position = point
        this.enableDraw = false
        this.parentElement = null
        this.edit = false
    }

    onMouseDown(editor, etype, e, p) {
        if (!this.DRAG) {
            p.setPermanentTarget(this)
            this.DRAG = true
            this.edit = true
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.MOUSEDOWN = {x,y,startx: this.position.x(), starty: this.position.y() }
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
                x: this.MOUSEDOWN.x,
                y: this.MOUSEDOWN.y
            }

            editor.cursor.snapToCoordinatesSystem(mmv, editor.world.getTransformation())

            const b = this.parentElement.getParentsTransformations().multiplyTM(this.parentElement.getTransformation()).inv().multiplyPoint(mmv.snap_x, mmv.snap_y) 

            //console.log(a[0] - b[0], a[1] - b[1])
            mmv = {
                x: this.MOUSEDOWN.startx + a[0] - b[0],
                y: this.MOUSEDOWN.starty + a[1] - b[1]
            }

            //editor.cursor.snapToCoordinatesSystem(mmv, editor.world.getTransformation())

            this.position.value(mmv.x, mmv.y)
            this.parentElement.buildPath()
            editor.draw()
            editor.clearForeground()
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

            //ctx.fill(Handle.staticPathSquare)

            ctx.strokeStyle = 'black'
            ctx.stroke(Handle.staticPathRound)
            ctx.fill(Handle.staticPathRound)
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
        i.arc(0, 0, 10, 0, Math.PI * 2)
        return i
    })()
})

Object.defineProperty(Handle, 'staticPathSquare', {
    value: (function () {
        const i = new Path2D()
        i.rect(-10, -10, 20, 20)
        return i
    })()
})