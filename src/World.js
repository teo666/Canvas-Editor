'use strict'

class World extends Common{
    constructor() {
        super();
        this.cursor = new Cursor();
        this.draw_cursor = true;
    }

    get getTransformation() {
        return math.clone(this.transformation);
    }

    get drawCursor(){
        return this.draw_cursor;
    }

    applyTransform(ctx) {
        if(! ctx instanceof CanvasRenderingContext2D){
            throw "invalid arguments"
        }
        let val = this.transformation.valueOf();
        ctx.setTransform(
            val[0][0],
            val[1][0],
            val[0][1],
            val[1][1],
            val[0][2],
            val[1][2]
        )
    }

    draw(context) {
        this.elements.forEach(element => {
            element.draw(context, this.getTransformation);
        });
    }

    hitTest(x, y) {
        let htl = [];
        let tr = this.getTransformation;
        this.elements.forEach(element => {
            let ret = element.hitTest(x, y, tr);
            if (ret instanceof Array) {
                htl = htl.concat(ret);
            } else if (ret) {
                htl.push(element);
            }
        })
        //console.log(this.name + " ht: ",htl)
        return htl;
    }

    get getParentsTransformations() {
        return math.identity(3);
    }


    //////////////////////////////////// event handling //////////////////////////////////

    mousedown(e) {
        let rvt = Object.assign(e, { parentTransformation: math.multiply(e.parentTransformation, this.getTransformation) })
        //console.log("world handle mousedown")
        return this.elements.some(el => {
            return el.mousedown(rvt)
        })

    }

    mousemove(e) {
        let rvt = Object.assign(e, { parentTransformation: math.multiply(e.parentTransformation, this.getTransformation) })
        //console.log("world handle mousedown")
        let ret = true;
        this.elements.forEach(el => {
            if (!el.mousemove(rvt)) {
                ret = false
                return false
            }
        })
        return ret;
    }

    mouseup(e) {
        let rvt = Object.assign(e, { parentTransformation: math.multiply(e.parentTransformation, this.getTransformation) })
        //console.log("world handle mousedown")
        let ret = true;
        this.elements.forEach(el => {
            if (!el.mouseup(rvt)) {
                ret = false
                return false
            }
        })
        return ret;
    }
}