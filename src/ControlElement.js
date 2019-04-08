'use strict'

class ControlElement {
    constructor() {
        Object.defineProperty(this, 'id', { value: ControlElement.retriveId() })
        this.name = ("controlElement" + this.id);
        this.controlList = []
        this.enable = true
        this.enableDraw = true
        this.parentElement = null
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
                id: (this.parentElement ? this.parentElement.id : '') +'-'+ this.id ,
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
                    id: { p: this.parentElement ? this.parentElement.id: null, id: this.id },
                    cursor: 'grab'
                })
            } catch (e) {
            }
        }
    }

    parent(e) {
        if (arguments.length) {
            this.parentElement = e
        }
        return this.parentElement
    }

    add(e) {
        if (e instanceof ControlElement) {
            this.controlList.push(e)
            return
        }
        throw "Invalid arguments"
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