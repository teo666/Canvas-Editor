'use strict'

class Handle extends ControlElement{
    constructor(point) {
        super()
        //TODO: introdurre il concetto di tipo delle maniglie
        this.type = null
        this.position = point
        this.parent = null
        this.enableDraw = true
        this.path = new Path2D()
        this.path.arc(this.position.x(), this.position.y() , 10, 0, Math.PI * 2)
    }

    addHitRegion(contextes, parentT, overrideTM = null) {
        let t
        if (overrideTM) {
            t = overrideTM
        } else {
            t = TransformationMatrix.multiply(parentT, this.transformation)
        }
        t = t.valueOf()
        let m
        let a = new Path2D()
        const p = this.hitPath ? this.hitPath : this.path
        try {
            //console.log(1)
            m = new DOMMatrix(t)
            a.addPath(p, m)
            contextes.fg.addHitRegion({
                path: a,
                id: (Math.random()*100) % 100,
                cursor: 'grab'
            })

        } catch (e) {
            m = document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGMatrix();
            m.a = t[0]
            m.b = t[1]
            m.c = t[2]
            m.d = t[3]
            m.e = t[4]
            m.f = t[5]
            a.addPath(p, m)
            try {
                contextes.fg.addHitRegion({
                    path: a,
                    id: (Math.random()*100) % 100,
                    cursor: 'grab'
                })
            } catch (e) {
            }
        }
    }

    draw(contextes, pT) {
        if (this.enableDraw) {

            let ctx = contextes.fg
            let p = pT.multiplyPoint(this.position.x(), this.position.y()).valueOf()

            ctx.save();

            ctx.setTransform(
                1,0,0,1,
                p[0],
                p[1]
            )
            ctx.fillStyle = 'white'
            ctx.beginPath()
            ctx.drawImage(Handle.source, - Handle.source.width/2 , - Handle.source.height/2)
            
            
            ctx.fill()
            ctx.closePath()
            //ctx.fill(this.path)
            
            ctx.restore();
            this.addHitRegion(contextes,null,pT)
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