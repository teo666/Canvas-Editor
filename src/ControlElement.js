'use strict'

class ControlElement {
    constructor() {
        Object.defineProperty(this, 'id', { value: ControlElement.retriveId() })
        this.name = ("controlElement" + this.id);
        this.enableDraw = true
        this.parentElement = null
        ControlElement._elements[this.id] = this
    }

    enable(b){
        this.enableDraw = b
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
        const p = this.hitPath ? this.hitPath : Handle.staticPathRound
        try {
            //console.log(1)
            m = new DOMMatrix(t)
            a.addPath(p, m)
            contextes.fg.addHitRegion({
                path: a,
                id: 'COEL' + this.id,
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
                    id: 'COEL' + this.id,
                    cursor: 'grab'
                })
            } catch (e) {
            }
        }
    }

    postChange(){
        
    }

    parent(e) {
        if (arguments.length && e instanceof Element) {
            this.parentElement = e
        }
        return this.parentElement
    }

}

Object.defineProperty(ControlElement, 'retriveId',
    {
        value: (function () {
            let i = 0;
            return function () {
                return i++;
            }
        })(),
        configurable: false,
        writable: false
    }
)

Object.defineProperty(ControlElement, '_elements', { value: {} })