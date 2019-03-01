'use strict'

class World extends Common{
    constructor() {
        super();
    }

    getTransformation() {
        return this.transformation;
    }

    applyTransform(ctx) {
        if(! ctx instanceof CanvasRenderingContext2D){
            throw "invalid arguments"
        }
        let v = this.transformation.valueOf();
        ctx.setTransform(
            v[0],
            v[1],
            v[2],
            v[3],
            v[4],
            v[5]
        )
    }

    draw(context) {
        this.elements.forEach(element => {
            if(!element.pending){
                element.draw(context, this.getTransformation);
            }
        });
    }

    hitTest(x, y, context) {
        let htl = [];
        let tr = this.getTransformation;
        this.elements.forEach(element => {
            let ret = element.hitTest(x, y, tr, context);
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
        return new TransformationMatrix()
    }


    //////////////////////////////////// event handling //////////////////////////////////

    mousedown(e) {
        let rvt = Object.assign(e, { parentTransformation: e.parentTransformation.multiply(this.getTransformation()) })
        //console.log("world handle mousedown")
        return this.elements.some(el => {
            return el.mousedown(rvt)
        })

    }

    mousemove(e) {
        let rvt = Object.assign(e, { parentTransformation: e.parentTransformation.multiply(this.getTransformation()) })
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
        let rvt = Object.assign(e, { parentTransformation: e.parentTransformation.multiply(this.getTransformation()) })
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