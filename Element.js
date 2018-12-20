'use strict'

class Element{
    constructor(){
        this.center = {};
        this.transformation = math.matrix([[1.0,0,0],[0,1.0,0],[0,0,1.0]]);
        this.r = math.matrix([[1.0,0,0],[0,1.0,0],[0,0,1.0]]);
        this.tss = math.matrix([[1.0,0,0],[0,1.0,0],[0,0,1.0]]);
        this.setCenter();
    }

    setCenter(x,y){
        this.center.x = x || 0;
        this.center.y = y || 0;
    }

    scale(h,w){
        let tm = math.matrix([[w,0,0],[0,h,0],[0,0,1]]);
        this.tss = math.multiply(this.tss, tm);
        this.applyTransform();
    }
    
    translate(x,y){
        let tm = math.matrix([[1.0,0,x],[0,1.0,y],[0,0,1.0]]);
        this.tss = math.multiply(this.tss, tm);
        this.applyTransform();
    }
    
    rotate(teta){
        let cos = math.cos(teta);
        let sin = math.sin(teta);
        let tm = math.matrix([[cos,sin,0],[-sin,cos,0],[0,0,1]]);
        this.r = math.multiply(this.r, tm);
        this.applyTransform();
    }

    reflectX() {
        this.tss = math.subset(this.tss, math.index(0,0), - math.subset(this.tss, math.index(0,0)))
        this.applyTransform();
    }
    reflectY() {
        this.tss = math.subset(this.tss, math.index(1,1), - math.subset(this.tss, math.index(1,1)))
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
        this.tss = math.multiply(this.tss, tm);
        this.applyTransform();
    }
    shearY(psi) {
        if(math.abs(psi % (2 * math.pi)) == math.pi/2){
            return;
        }
        let tan = math.tan(psi);
        let tm = math.matrix([[1.0,tan,0],[0,1.0,0],[0,0,1.0]]);
        this.tss = math.multiply(this.tss, tm);
        this.applyTransform();
    }
    shearXY(psix,psiy) {
        this.shearX(psix);
        this.shearY(psiy);
    }
    
    applyTransform(){
        let res = math.multiply(this.tss, this.r);
        res = math.multiply(res, this.r);
        this.transformation = res;
    }
    
    
}