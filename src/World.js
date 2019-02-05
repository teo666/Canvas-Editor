'use strict'

class World{
    constructor(){
        this.transformation = math.identity(3,3);
        this.elements = [];
        this.scale_factor = {
            x: 1,
            y: 1
        }
    }

     get getScaleFactor(){
        return {
            x: this.scale_factor.x ,
            y: this.scale_factor.y
        }
    }

    get getTransformation(){
        return math.clone(this.transformation);
    }

    translate(x,y) {
        let tm = math.matrix([[1.0,0,x],[0,1.0,y],[0,0,1.0]]);
        this.transformation = math.multiply(this.transformation, tm);
        return tm;
    }

    translateAdd(x,y){
        let tm = math.matrix([[0,0,x],[0,0,y],[0,0,0]]);
        this.transformation = math.add(this.transformation, tm);
        return tm;
    }
    
    rotate(teta) {
        let cos = math.cos(teta);
        let sin = math.sin(teta);
        let tm = math.matrix([[cos,sin,0],[-sin,cos,0],[0,0,1]]);
        this.transformation = math.multiply(this.transformation, tm);
        return tm;
    }
    
    scale(w,h) {
        this.scale_factor.x *= w;
        this.scale_factor.y *= h;
        let tm = math.matrix([[w,0,0],[0,h,0],[0,0,1]]);
        this.transformation = math.multiply(this.transformation, tm);
        return tm;
    }
    
    scaleOnPoint(w,h,cx,cy){
        let c = math.multiply( math.inv(this.scale(w,h)), [cx,cy,1]);
        let t = math.subtract(c, [cx,cy,0]);
        this.translate( math.subset(t, math.index(0)), math.subset(t, math.index(1)));
    }
    
    applyTransform(ctx){
        ctx.setTransform(
            math.subset(this.transformation,math.index(0,0)),
            math.subset(this.transformation,math.index(1,0)),
            math.subset(this.transformation,math.index(0,1)),
            math.subset(this.transformation,math.index(1,1)),
            math.subset(this.transformation,math.index(0,2)),
            math.subset(this.transformation,math.index(1,2))
        )
    }

    addElement(el){
        if( el instanceof Element){
            if(!el.parent){
                el.parent = this;
            }
            this.elements.push(el);
        } else {
            throw "Try to add non Element instance"
        }
    }

    draw(){
        this.elements.forEach(element => {
            element.draw(this.getTransformation);
        });
    }

    hitTest(x,y){
        let htl = [];
        let tr = this.getTransformation;
        this.elements.forEach(element => {
            let ret = element.hitTest(x,y,tr);
            if(ret instanceof Array){
                htl = htl.concat(ret);
            } else if(ret){
                htl.push(element);
            }
        })
        //console.log(this.name + " ht: ",htl)
        return htl;
    }

    get getParentsTransformations(){
        return math.identity(3);
    }


    //////////////////////////////////// event handling //////////////////////////////////
    
    mousedown(e){
        let rvt = Object.assign(e, {parentTransformation : math.multiply( e.parentTransformation, this.getTransformation )})
        //console.log("world handle mousedown")
        let ret = true;
        this.elements.forEach( el => {
            if(!el.mousedown(rvt)){
                ret = false
                return false
            }
        })
        return ret;
    }

    mousemove(e){
        let rvt = Object.assign(e, {parentTransformation : math.multiply( e.parentTransformation, this.getTransformation ) })
        //console.log("world handle mousedown")
        let ret = true;
        this.elements.forEach( el => {
            if(!el.mousemove(rvt)){
                ret = false
                return false
            }
        })
        return ret;
    }

    mouseup(e){
        let rvt = Object.assign(e, {parentTransformation : math.multiply( e.parentTransformation, this.getTransformation )})
        //console.log("world handle mousedown")
        let ret = true;
        this.elements.forEach( el => {
            if(!el.mouseup(rvt)){
                ret = false
                return false
            }
        })
        return ret;
    }
}