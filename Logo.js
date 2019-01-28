'use strict'

class Logo extends Element{
    constructor(s){
        super();
        this.radius = 325;
        this.rotatez = 0;
    }

    setSource(s){
        return new Promise((resolve, reject) => {
            this.img = new Image();
            this.img.addEventListener('load', e => resolve(this.img));
            this.img.addEventListener('error', () => {
                reject(new Error(`Failed to load image's URL: ${s}`));
            });
            this.img.src = s;
        })
    }

    getImageDimension(){
        return {
            w : this.img.width,
            h : this.img.height
        }
    }

    hitTest(x,y,tr){
        //x e y coordinate dell'evento, quindi relative al canvas
        let t = math.multiply(tr ,this.getTransformation())
        let rz = math.matrix([[math.cos(this.rotatez),0,0],[0,1,0],[0,0,1]]);
        let diff = math.subtract( math.multiply( math.inv(rz), [this.img.width/2, 0, 1]), [this.img.width/2, 0, 1]);
        let tm = math.matrix([[1.0,0,math.subset(diff, math.index(0)) ],[0,1.0, math.subset(diff, math.index(1)) ],[0,0,1.0]]) ;
        t = math.multiply(t, rz);
        t = math.multiply(t, tm)
        //effettuare il prodotto di tutte le trasformazioni equivale ad effettuare un cambio di base
        // t rappresenta la trasformazione che porta il sistema di riferimento sull'origine della figura
        //console.log("trasformazione globale dell'oggetto rispetto al angolo in alto a sinistra" ,t )
        //console.log(math.multiply(t, [0,0,1]))
        let p = math.multiply(math.inv(t), [x,y,1])
        let radius = this.img.width/2
        //console.log("coordinate del punto sull'elemento originale senza considerare le trasformazioni",math.subset(p, math.index(0)), math.subset(p,math.index(1)))
        p = math.subtract(p, [radius, radius,1])

        //console.log(math.multiply(p,p))
        if(math.multiply(p,p) < (radius*radius) ){
            return true;
        }
        return false;
    }

    rotateZ(teta){
        this.rotatez += teta;
    }

    draw(world){
        ctx.save();
    
        let ts = math.multiply(world, this.transformation);

        /*solo per gestire la rotazione sull'asse z*/
        let rz = math.matrix([[math.cos(this.rotatez),0,0],[0,1,0],[0,0,1]]);
        let diff = math.subtract( math.multiply( math.inv(rz), [this.img.width/2, 0, 1]), [this.img.width/2, 0, 1]);
        let tm = math.matrix([[1.0,0,math.subset(diff, math.index(0)) ],[0,1.0, math.subset(diff, math.index(1)) ],[0,0,1.0]]);

        ts = math.multiply(ts, rz);
        ts = math.multiply(ts, tm)
        /*************** */
        
        ctx.setTransform(
            math.subset(ts,math.index(0,0)),
            math.subset(ts,math.index(1,0)),
            math.subset(ts,math.index(0,1)),
            math.subset(ts,math.index(1,1)),
            math.subset(ts,math.index(0,2)),
            math.subset(ts,math.index(1,2))
        )

        ctx.drawImage(
            this.img,
            0,                      //clip start x
            0,                      //clip start y
            this.img.width-0,         //clip width
            this.img.height-0,        //clip height
            0,//-this.center.x+0,
            0,//-this.center.y+0,
            this.img.width-0,
            this.img.height-0
        );
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, this.img.width, this.img.height);
        ctx.restore();
    }
}

