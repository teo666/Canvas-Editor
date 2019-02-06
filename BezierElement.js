'using strict'

class BezierElement extends Element{

    constructor(...args){
        super();
        this.value(...args);
        let size = new Size2D(5,5)
    }

    value(...args){
        if(args.length == 4 &&
            args[0] instanceof Point2D &&
            args[1] instanceof Point2D &&
            args[2] instanceof Point2D &&
            args[3] instanceof Point2D){
                let size = new Size2D(5,5)
                this.lh1 = new LineHandle(args[0], size, args[1], size)
                this.lh2 = new LineHandle(args[2], size,args[3], size)

                this.bezier = new Bezier(args[0], args[1], args[2], args[3]);

                this.addElement(this.bezier)
                this.addElement(this.lh1)
                this.addElement(this.lh2)
            } else {
                throw "invalid arguments"
            }
    }

    mousedown(e){
        //console.log("be")
        let rvt = Object.assign(e, {parentTransformation : math.multiply( e.parentTransformation, this.getTransformation )})
        return this.elements.some(el => {
            if(el instanceof LineHandle){
                return el.mousedown(rvt)
            }
        });
    }

    mousemove(e){
        let rvt = Object.assign(e, {parentTransformation : math.multiply( e.parentTransformation, this.getTransformation )})
        return this.elements.some(el => {
            if(el instanceof LineHandle){
                let ret = el.mousemove(rvt)

                //the event has been handled by someone
                if(ret){
                    this.bezier.value(
                        this.lh1.startHandle.transformedCenter(),
                        this.lh1.endHandle.transformedCenter(),
                        this.lh2.startHandle.transformedCenter(),
                        this.lh2.endHandle.transformedCenter()
                    )
                    draw()
                    return true
                }
            }
        });
    }

    mouseup(e){
        let rvt = Object.assign(e, {parentTransformation : math.multiply( e.parentTransformation, this.getTransformation )})
        return this.elements.forEach(el => {
            if(el instanceof LineHandle){
                return el.mouseup(rvt)
            }
        });
    }

}