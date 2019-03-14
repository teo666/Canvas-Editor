'use strict'

class Element extends Common {
    constructor() {
        super();
        Object.defineProperty(this, 'id', {value : Element.retriveId()})
        this.name = ("element" + this.id);
        this.pending = false;
        this.enableDraw = true
        this.selected = true
        this.pivot = new Pivot()
    }

    isPending() {
        return this.pending
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

    draw(context, parentT) {
        let ts = parentT.clone().multiply(this.getTransformation())
        this.elements.forEach(element => {
            if (!element.pending) {
                element.draw(context, ts);
            }
        });
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