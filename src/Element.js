'use strict'
//TODO aggiungere controllo nan su setter
let _nel = 0;

class Element extends Common {
    constructor() {
        super();
        this.name = ("element" + ++_nel);
        this.id = _nel;
        this.pending = false;
    }

    get isPending() {
        return this.pending
    }

    reflectX() {
        this.transformation = math.subset(this.transformation, math.index(0, 0), - math.subset(this.transformation, math.index(0, 0)))
    }

    reflectY() {
        this.transformation = math.subset(this.transformation, math.index(1, 1), - math.subset(this.transformation, math.index(1, 1)))
    }

    reflectXY() {
        this.reflectX();
        this.reflectY();
    }

    shearX(psi) {
        if (! typeof psi == "number" || math.abs(psi % (2 * math.pi)) == math.pi / 2) {
            return;
        }
        let tan = math.tan(psi);
        let tm = math.matrix([[1.0, 0, 0], [tan, 1.0, 0], [0, 0, 1.0]]);
        this.transformation = math.multiply(this.transformation, tm);
        return tm;
    }
    shearY(psi) {
        if (! typeof psi == "number" || math.abs(psi % (2 * math.pi)) == math.pi / 2) {
            return;
        }
        let tan = math.tan(psi);
        let tm = math.matrix([[1.0, tan, 0], [0, 1.0, 0], [0, 0, 1.0]]);
        this.transformation = math.multiply(this.transformation, tm);
        return tm;
    }
    shearXY(psix, psiy) {
        this.shearX(psix);
        this.shearY(psiy);
    }

    scaleOnElementPoint(...args) {
        this.scaleOnPoint(...args)
    }

    scaleOnWorldPoint(...args) {
        let w, h, cx, cy;
        if (args.length == 2) {
            if ((args[0] instanceof Point2D || args[0] instanceof Size2D) &&
                (args[1] instanceof Point2D || args[1] instanceof Size2D)) {
                w = args[0].w
                h = args[0].h
                cx = args[1].x
                cy = args[1].y
            }
        } else if (args.length == 4 &&
            typeof args[0] == "number" &&
            typeof args[1] == "number" &&
            typeof args[2] == "number" &&
            typeof args[3] == "number") {
            w = args[0];
            h = args[1];
            cx = args[2];
            cy = args[3];
        } else if (args.length == 0 && args[0] instanceof Array) {
            w = args[0][0];
            h = args[0][1];
            cx = args[0][2];
            cy = args[0][3];
        } else {
            throw "invalid arguments"
        }
        //prendo le coordinate del mondo e le porto nell'immagine e poi utilizzo l'altra funzione
        let toimage = math.multiply(math.inv(this.transformation), math.matrix([cx, cy, 1])).valueOf()
        //console.log(math.subset(toimage,math.index(0)) , math.subset(toimage,math.index(1)))
        this.scaleOnElementPoint(w, h, toimage[0], toimage[1])
    }

    rotateOnElementPoint(...args) {
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
        let c = math.multiply(math.inv(this.rotate(teta)), [x, y, 1]);
        let t = math.subtract(c, [x, y, 0]).valueOf();
        this.translate(t[0], t[1]);
    }

    rotateOnWorldPoint(...args) {
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
        //prendo le coordinate del mondo e le porto nell'immagine e poi utilizzo l'altra funzione
        let t = math.multiply(math.inv(this.transformation), math.matrix([x, y, 1])).valueOf()
        //console.log(math.subset(toimage,math.index(0)) , math.subset(toimage,math.index(1)))
        this.rotateOnElementPoint(teta, t[0], t[1])
    }

    shearXOnElementPoint(...args) {
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
        let c = math.multiply(math.inv(this.shearX(teta)), [x, y, 1]);
        let t = math.subtract(c, [x, y, 0]).valueOf();
        this.translate(t[0], t[1]);
    }

    shearYOnElementPoint(...args) {
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
        let c = math.multiply(math.inv(this.shearY(teta)), [x, y, 1]);
        let t = math.subtract(c, [x, y, 0]).valueOf();
        this.translate(t[0], t[1]);
    }

    shearXYOnElementPoint(...args) {
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
        this.shearXOnElementPoint(teta, x, y);
        this.shearYOnElementPoint(teta, x, y);
    }

    hitTest(x, y, tr, context) {
        let htl = [];
        let t = math.multiply(tr, this.getTransformation)
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
        let ts = math.multiply(parentT, this.getTransformation)
        this.elements.forEach(element => {
            if(!element.pending){
                element.draw(context, ts);
            }
        });
    }

    get getParentsTransformations() {
        return math.multiply(this.parent.getParentsTransformations(), this.parent.getTransformation());
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