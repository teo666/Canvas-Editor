'use strict'

class Element{
    constructor(){
        this.center = {};
        this.parent = world;
        this.transformation = math.matrix([[1.0,0,0],[0,1.0,0],[0,0,1.0]]);
        this.r = math.matrix([[1.0,0,0],[0,1.0,0],[0,0,1.0]]);
        this.tss = math.matrix([[1.0,0,0],[0,1.0,0],[0,0,1.0]]);
        this.setCenter();
    }

    setCenter(x,y){
        this.center.x = x || 0;
        this.center.y = y || 0;
    }

    scale(w,h){
        let tm = math.matrix([[w,0,0],[0,h,0],[0,0,1]]);
        this.tss = math.multiply(this.tss, tm);
        this.applyTransform();
    }

    scaleOnPoint(w,h,cx,cy){
        /******** */
        let _old = math.multiply( this.transformation , math.matrix([cx,cy,1]) )
        this.scale(w,h);
        let _new = math.multiply( this.transformation , math.matrix([cx,cy,1]) )
        let res = math.subtract(_new , _old);
        let scale = math.matrix([[1/math.subset(this.tss,math.index(0,0)),0,0],[0,1/math.subset(this.tss,math.index(1,1)),0],[0,0,1.0]]);
        res = math.multiply(scale, res );
        this.translate(- math.subset(res,math.index(0)) ,- math.subset(res,math.index(1)) )
    }

    scaleOnWorldPoint(w,h, cx, cy){
        /******** */
        //prendo le coordinate del mondo e le porto nell'immagine e poi utilizzo l'altra funzione
        let toimage = math.multiply( math.inv(this.transformation) , math.matrix([cx,cy,1]) )
        //console.log(math.subset(toimage,math.index(0)) , math.subset(toimage,math.index(1)))
        this.scaleOnPoint( w,h, math.subset(toimage,math.index(0)) , math.subset(toimage,math.index(1)) ) 
    }
    
    translate(x,y){
        let tm = math.matrix([[1.0,0,x],[0,1.0,y],[0,0,1.0]]);
        this.tss = math.multiply(this.tss, tm);
        this.applyTransform();
    }

    translateAdd(x,y){
        let tm = math.matrix([[0,0,x],[0,0,y],[0,0,0]]);
        this.tss = math.add(this.tss, tm);
        this.applyTransform();
    }
    
    rotate(teta){
        let cos = math.cos(teta);
        let sin = math.sin(teta);
        let tm = math.matrix([[cos,sin,0],[-sin,cos,0],[0,0,1]]);
        this.r = math.multiply(this.r, tm);
        this.applyTransform();
    }

    rotateOnElementPoint(teta, x, y){
        /******** */
        //ritorna le coordinate dell'attuale centro di rotazione sul mondo
        let _old = math.multiply( this.transformation , math.matrix([x,y,1]) )
        //console.log(math.subset(_old,math.index(0)) , math.subset(_old,math.index(1)))
        this.rotate(teta);
        let _new = math.multiply( this.transformation , math.matrix([x,y,1]) )
        let res = math.subtract(_new , _old);
        //moltiplico la differenza per l'inverso del fattore di scala
        let scale = math.matrix([[1/math.subset(this.tss,math.index(0,0)),0,0],[0,1/math.subset(this.tss,math.index(1,1)),0],[0,0,1.0]]);
        res = math.multiply(scale, res );
        this.translate(- math.subset(res,math.index(0)) ,- math.subset(res,math.index(1)) )
    }

    rotateOnWorldPoint(teta, x, y){
        /******** */
        //prendo le coordinate del mondo e le porto nell'immagine e poi utilizzo l'altra funzione
        let toimage = math.multiply( math.inv(this.transformation) , math.matrix([x,y,1]) )
        //console.log(math.subset(toimage,math.index(0)) , math.subset(toimage,math.index(1)))
        this.rotateOnElementPoint( teta, math.subset(toimage,math.index(0)) , math.subset(toimage,math.index(1)) ) 
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
        this.transformation = math.multiply(this.tss, this.r);
    }

    hitTest(x,y){
        return false;
    }
    
    
}