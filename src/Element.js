'use strict'

let _nel = 0;

class Element{
    constructor(name){
        this.name = name || ("element"+_nel++);
        this.center = {};
        this.transformation = math.matrix([[1.0,0,0],[0,1.0,0],[0,0,1.0]]);
        this.r = math.matrix([[1.0,0,0],[0,1.0,0],[0,0,1.0]]);
        this.tss = math.matrix([[1.0,0,0],[0,1.0,0],[0,0,1.0]]);
        this.setCenter();
        this.elements = [];
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
        //console.log("coordinate elemento:" ,x,y)
        /*
        1) applico tutte le trasformazioni sull'oggetto (qui è già fatto)
        2) vado a prendere il punto dell'oggetto in questione e guardo dov'è sul mondo
        3) applico la rotazione
        4) vado a prendere il punto dell'oggetto in questione e guardo dov'è sul mondo
        5) calcolo la differenza fra 2 e 4
        6) faccio la diferenza e traslo
        */
        /*
        VERSIONE 2
        let p = this.getParentsTransformations();

        let base1 = math.multiply(p ,this.getTransformation());

        //prende il centro di rotazione prima della trasformazione relativamente al canvas
        let centro_old_c = math.multiply(base1, [x,y,1]);
        //console.log("centro di rotazione prima della rotazione relativamente al canvas: ", centro_old._data)
        //effettuo la rotazione
        this.rotate(teta);
        //prende il centro di rotazione dopo la trasformazione relativamente al canvas
        let base2 = math.multiply(p ,this.getTransformation());
        let centro_new_c = math.multiply(base2, [x,y,1]);

        //calcolo la differenza di distanza fra nuovo e vecchio
        let diff_c = math.subtract(centro_old_c, centro_new_c)
        let diff_w = math.multiply(base2,diff_c);
        //questi sono pixel sullo schermo quindi comprende tutte le trasformazioni effettuate
        //console.log("differenza: ", diff_c._data,)
        //console.log("differenza2: ", diff_w._data)

        //console.log("norma1: ", math.norm(diff_c))
        //console.log("norma2: ", math.norm(diff_w))

        let scale = math.norm(diff_c) / math.norm(diff_w)
        //diff = math.multiply( math.inv(base2), diff )
        this.translate(  math.subset(diff_c, math.index(0))*scale,  math.subset(diff_c, math.index(1) )*scale );*/


        //ritorna le coordinate dell'attuale centro di rotazione sul mondo
       /* VERSIONE 1
        let _old = math.multiply( this.transformation , math.matrix([x,y,1]) )
        console.log("coordinate del centro sul mondo",math.subset(_old,math.index(0)) , math.subset(_old,math.index(1)))
        this.rotate(teta);
        let _new = math.multiply( this.transformation , math.matrix([x,y,1]) )
        let res = math.subtract(_new , _old);
        //moltiplico la differenza per l'inverso del fattore di scala
        let scale = math.matrix([[1/math.subset(this.tss,math.index(0,0)),0,0],[0,1/math.subset(this.tss,math.index(1,1)),0],[0,0,1.0]]);
        res = math.multiply(scale, res );
        this.translate(- math.subset(res,math.index(0)) ,- math.subset(res,math.index(1)) )
        */
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