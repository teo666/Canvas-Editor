'use strict'

class World{
    constructor(){
        this.ts = math.matrix([[1.0,0,0],[0,1.0,0],[0,0,1.0]]);
        this.r = math.matrix([[1.0,0,0],[0,1.0,0],[0,0,1.0]]);

        this.transformation = math.matrix([[1.0,0,0],[0,1.0,0],[0,0,1.0]]);
        this.elements = [];
    }

    getScaleFactor(){
        return{
                x : math.subset(this.ts,math.index(0,0)),
                y : math.subset(this.ts,math.index(1,1))
            }
    }

    getTransformation(){
        return math.clone(this.transformation);
    }

    getTranslationSkew(){
        return math.clone(this.ts);
    }

    getRotation(){
        return math.clone(this.r);
    }

    translate(x,y) {
        let tm = math.matrix([[1.0,0,x],[0,1.0,y],[0,0,1.0]]);
        this.ts = math.multiply(this.ts, tm);
    }

    translateAdd(x,y){
        let tm = math.matrix([[0,0,x],[0,0,y],[0,0,0]]);
        this.ts = math.add(this.ts, tm);
    }
    
    rotate(teta) {
        let cos = math.cos(teta);
        let sin = math.sin(teta);
        let tm = math.matrix([[cos,sin,0],[-sin,cos,0],[0,0,1]]);
        this.r = math.multiply(this.r, tm);
    }
    
    scale(w,h) {
        let tm = math.matrix([[w,0,0],[0,h,0],[0,0,1]]);
        this.ts = math.multiply(this.ts, tm);
    }
    
    scaleOnPoint(w,h,cx,cy){
        let old_point = math.multiply(math.inv(this.ts), [cx,cy,1]);
        this.scale(w,h);
        let new_point = math.multiply(math.inv(this.ts), [cx,cy,1]);
        let diff = math.subtract(new_point, old_point);
        this.translate( math.subset(diff,math.index(0)) , math.subset(diff,math.index(1)) );
    }
    
    applyTransform(ctx){
        this.transformation = math.multiply(this.ts, this.r);

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
            element.draw(this.getTransformation());
        });
    }

    hitTest(x,y){
        let htl = [];
        let tr = this.getTransformation();
        this.elements.forEach(element => {
            htl = htl.concat(element.hitTest(x,y,tr))
        })
        //console.log(this.name + " ht: ",htl)
        return htl;
    }

}