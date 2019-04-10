'use strict'

class Handle extends ControlElement {
    constructor(point) {
        super()
        //TODO: introdurre il concetto di tipo delle maniglie
        this.type = null
        this.position = point
        this.enableDraw = false
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
            this.addHitRegion(contextes, null, new TransformationMatrix().translate(p[0],p[1]))
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