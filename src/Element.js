'use strict'

class Element extends Common {
    constructor() {
        super();
        Object.defineProperty(this, 'id', { value: Element.retriveId() })
        this.name = ("element" + this.id);

        //set element in adding mode
        this.adding = false

        //enable or disable drawing
        this.enableDraw = true
        this.selected = true
        this.pivot = new Pivot()
        this.pivot.parent(this)

        this.controls = new ControlList()
        this.controls.add(this.pivot)

        Element._elements[this.id] = this
    }

    toggleSelected(contextes, t) {
        this.selected = !this.selected
    }

    select(sel) {
        return this.selected = sel && true
    }

    enable() {
        return this.enableDraw = true
    }

    add(b) {
        if (arguments.length) {
            this.adding = ((b && true) || false)
        }
        return this.adding
    }

    disable() {
        return this.enableDraw = false
    }

    reflectX() {
        this.transformation.reflectX()
        return this
    }

    reflectY() {
        this.transformation.reflectY()
        return this
    }

    reflectXY() {
        this.transformation.reflectXY()
        return this
    }

    shearX(psi) {
        if (! typeof psi == "number" || Math.abs(psi % (2 * Math.pi)) == Math.pi / 2) {
            return;
        }
        this.transformation.shearX(psi)
    }

    shearY(psi) {
        if (! typeof psi == "number" || math.abs(psi % (2 * math.pi)) == math.pi / 2) {
            return;
        }
        this.transformation.shearY(psi)
    }

    shearXY(psix, psiy) {
        this.shearX(psix);
        this.shearY(psiy);
    }

    shearXOnPoint(...args) {
        let teta, x, y;
        if (args.length == 2 && typeof args[0] == "number" && (args[1] instanceof Point2D || args[1] instanceof Size2D)) {
            teta = args[0];
            x = args[1].x;
            y = args[1].y
        } else if (args.length == 3 && typeof args[0] == "number" && typeof args[1] == "number" && typeof args[2] == "number") {
            teta = args[0];
            x = args[1];
            y = args[2];
        } else {
            throw "Invalid arguments"
        }
        this.transformation.shearXOnPoint(teta, x, y)
    }

    shearYOnPoint(...args) {
        let teta, x, y;
        if (args.length == 2 && typeof args[0] == "number" && (args[1] instanceof Point2D || args[1] instanceof Size2D)) {
            teta = args[0];
            x = args[1].x;
            y = args[1].y
        } else if (args.length == 3 && typeof args[0] == "number" && typeof args[1] == "number" && typeof args[2] == "number") {
            teta = args[0];
            x = args[1];
            y = args[2];
        } else {
            throw "Invalid arguments"
        }
        this.transformation.shearYOnPoint(teta, x, y)
    }

    shearXYOnPoint(...args) {
        let teta, x, y;
        if (args.length == 2 && typeof args[0] == "number" && (args[1] instanceof Point2D || args[1] instanceof Size2D)) {
            teta = args[0];
            x = args[1].x;
            y = args[1].y
        } else if (args.length == 3 && typeof args[0] == "number" && typeof args[1] == "number" && typeof args[2] == "number") {
            teta = args[0];
            x = args[1];
            y = args[2];
        } else {
            throw "Invalid arguments"
        }
        this.transformation.shearXYOnPoint(teta, x, y)
    }

    hitTest(x, y, tr, context) {
        let htl = [];
        let t = tr.clone().multiply(this.getTransformation())
        this.elements.forEach(element => {
            let ret = element.hitTest(x, y, t, context);
            if (ret instanceof Array) {
                htl = htl.concat(ret);
            } else if (ret) {
                htl.push(element);
            }
        });
        //console.log(this.name + " ht: ",ht)
        return htl;
    }

    /**
    * FIXME:
    * questo metodo permette di creare una regione di hitTest intorno agli oggetti disegnati nel canvas,
    * il vantaggio di questa cosa e che si utilizzano delle primitive del motore e non necessita di creare 
    * una regione di hittest manualmente nella definizione degli oggetti
    * i contro pero' sono molti:
    *  - funzionalita' sperimentale per tutti i browser se non disponibile (03/2019)
    *  - >> non funziona per le linee <<
    *  - gli oggetti dommatrix sono sperimentali
    *  - la regione di hittest non e' accurata a causa del fatto che non viene tenuto conto delle linee
    *      per cui un rettangolo con un bordo di 100 per esempio viene individuato solamente sul suo riempimento
    *  - in caso di animazione e' necessario cancellare la hitregion e ricrearla così come quando una proprietà 
    * dell'oggetto viene modificata
    * 
    * Tuttavia l'utilizzo di tale primitiva permette in un certo qual senso di rendere piu' efficiente l'hittesting
    * prima di scandire tutti gli elementi nell'albero e' possibile ricorrere prima a questo metodo, se nessun risultato 
    * viene dato si procede con il metodo manuale
    *
    * */

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
                id: this.id,
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
                    id: this.id,
                    cursor: 'grab'
                })
            } catch (e) {
            }
        }
    }

    /**
     * overrideTM permette di evitare di fare il prodotto delle matrici di trasformazione laddove esso sia gia' stato effettuato
     * per esempio nei casi di riscrittura della funzione draw
     */
    draw(contextes, parentT, overrideTM = null) {
        let ts
        if (overrideTM) {
            ts = overrideTM
        } else {
            ts = TransformationMatrix.multiply(parentT, this.transformation)
        }
        //this.addHitRegion(contextes.fg)
        this.elements.forEach(element => {
            element.draw(contextes, ts);
        });
    }

    enablePivot(b) {
        if (arguments.length) {
            this.pivot.enableDraw = ((b && true) || false)
        }
        return this.pivot.enableDraw
    }

    drawControlElements(contextes, parentT) {
        this.controls.draw(contextes, TransformationMatrix.multiply(parentT, this.transformation))
    }

    getParentsTransformations() {
        let pp = this.parent.getParentsTransformations()
        let p = this.parent.getTransformation()
        return TransformationMatrix.multiply(pp, p);
    }

    //////////////////////////////////// event handling //////////////////////////////////

    mousedown(e) {
        //console.log("element handle mousedown")
        let rvt = Object.assign(e, { parentTransformation: this.getTransformation })
        let ret = true;
        this.elements.forEach(el => {
            if (!el.mousedown(rvt)) {
                ret = false
                return false;
            }
        })
        return ret;
    }

    mousemove(e) {
        //console.log("element handle mousedown")
        let rvt = Object.assign(e, { parentTransformation: this.getTransformation })
        let ret = true;
        this.elements.forEach(el => {
            if (!el.mousemove(rvt)) {
                ret = false
                return false;
            }
        })
        return ret;
    }

    mouseup(e) {
        //console.log("element handle mousedown")
        let rvt = Object.assign(e, { parentTransformation: this.getTransformation })
        let ret = true;
        this.elements.forEach(el => {
            if (!el.mouseup(rvt)) {
                ret = false
                return false;
            }
        })
        return ret;
    }
}

Object.defineProperty(Element, 'retriveId',
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


Object.defineProperty(Element, '_elements', { value: {} })