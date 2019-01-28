'use strict'

let _nel = 0;

class Element{
    constructor(name){
        this.name = name || ("element"+_nel++);
        this.transformation = math.identity(3,3);
        this.elements = [];
        this.scale_factor = {
            x: 1,
            y: 1
        }
    }

    getScaleFactor(){
        return {
            x: this.scale_factor.x ,
            y: this.scale_factor.y
        }
    }

    scale(w,h){
        let tm = math.matrix([[w,0,0],[0,h,0],[0,0,1]]);
        this.transformation = math.multiply(this.transformation, tm);
        return tm;
    }

    translate(x,y){
        let tm = math.matrix([[1.0,0,x],[0,1.0,y],[0,0,1.0]]);
        this.transformation = math.multiply(this.transformation, tm);
    }

    translateAdd(x,y){
        let tm = math.matrix([[0,0,x],[0,0,y],[0,0,0]]);
        this.transformation = math.add(this.transformation, tm);
    }

    rotate(teta){
        let cos = math.cos(teta);
        let sin = math.sin(teta);
        let tm = math.matrix([[cos,sin,0],[-sin,cos,0],[0,0,1]]);
        this.transformation = math.multiply(this.transformation, tm);
        return tm;
    }

    reflectX() {
        this.transformation = math.subset(this.transformation, math.index(0,0), - math.subset(this.transformation, math.index(0,0)))
        this.applyTransform();
    }

    reflectY() {
        this.transformation = math.subset(this.transformation, math.index(1,1), - math.subset(this.transformation, math.index(1,1)))
        this.applyTransform();
    }

    reflectXY() {
        this.reflectX();
        this.reflectY();
    }

    shearX(psi) {
        if(math.abs(psi % (2 * math.pi)) == math.pi/2){
            return;
        }
        let tan = math.tan(psi);
        let tm = math.matrix([[1.0,0,0],[tan,1.0,0],[0,0,1.0]]);
        this.transformation = math.multiply(this.transformation, tm);
        return tm;
    }
    shearY(psi) {
        if(math.abs(psi % (2 * math.pi)) == math.pi/2){
            return;
        }
        let tan = math.tan(psi);
        let tm = math.matrix([[1.0,tan,0],[0,1.0,0],[0,0,1.0]]);
        this.transformation = math.multiply(this.transformation, tm);
        return tm;
    }
    shearXY(psix,psiy) {
        this.shearX(psix);
        this.shearY(psiy);
    }

    scaleOnElementPoint(w,h,cx,cy){
        let c = math.multiply( math.inv(this.scale(w,h)), [cx,cy,1]);
        let t = math.subtract(c, [cx,cy,0]);
        this.translate( math.subset(t, math.index(0)), math.subset(t, math.index(1)));
    }

    scaleOnWorldPoint(w,h, cx, cy){
        /******** */
        //prendo le coordinate del mondo e le porto nell'immagine e poi utilizzo l'altra funzione
        let toimage = math.multiply( math.inv(this.transformation) , math.matrix([cx,cy,1]) )
        //console.log(math.subset(toimage,math.index(0)) , math.subset(toimage,math.index(1)))
        this.scaleOnElementPoint( w,h, math.subset(toimage,math.index(0)) , math.subset(toimage,math.index(1)) ) 
    }
    
    rotateOnElementPoint(teta, x, y){
        let c = math.multiply( math.inv(this.rotate(teta)), [x,y,1]);
        let t = math.subtract(c, [x,y,0]);
        this.translate( math.subset(t, math.index(0)), math.subset(t, math.index(1)));
    }

    rotateOnWorldPoint(teta, x, y){
        /******** */
        //prendo le coordinate del mondo e le porto nell'immagine e poi utilizzo l'altra funzione
        let toimage = math.multiply( math.inv(this.transformation) , math.matrix([x,y,1]) )
        //console.log(math.subset(toimage,math.index(0)) , math.subset(toimage,math.index(1)))
        this.rotateOnElementPoint( teta, math.subset(toimage,math.index(0)) , math.subset(toimage,math.index(1)) ) 
    }

    shearXOnElementPoint(teta, x, y){
        let c = math.multiply( math.inv(this.shearX(teta)), [x,y,1]);
        let t = math.subtract(c, [x,y,0]);
        this.translate( math.subset(t, math.index(0)), math.subset(t, math.index(1)));
    }

    shearYOnElementPoint(teta, x, y){
        let c = math.multiply( math.inv(this.shearY(teta)), [x,y,1]);
        let t = math.subtract(c, [x,y,0]);
        this.translate( math.subset(t, math.index(0)), math.subset(t, math.index(1)));
    }

    shearXYOnElementPoint(teta, x, y){
        this.shearXOnElementPoint(teta, x, y);
        this.shearYOnElementPoint(teta, x, y);
    }

    getTransformation(){
        return math.clone(this.transformation);
    }

    hitTest(x,y,tr){
        let htl = [];
        let t = math.multiply(tr ,this.getTransformation() )
        this.elements.forEach(element => {
            let ret = element.hitTest(x,y,t);
            if(ret instanceof Array){
                htl = htl.concat(ret);
            } else if(ret){
                htl.push(element);
            }
        });
        //console.log(this.name + " ht: ",ht)
        return htl;
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

    draw(parentT){
        this.elements.forEach(element => {
            element.draw( math.multiply(parentT ,this.getTransformation() ) );
        });
    }
    
    getParentsTransformations(){
        return math.multiply(this.parent.getParentsTransformations(), this.parent.getTransformation());
    }
    
}