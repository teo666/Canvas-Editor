'use strict'

class Ellipse extends Element{
    constructor(w, h){
        super();
        this.path = null;
        this.buildPath(w,h);
        this.width = w;
        this.height = h;
    }

    buildPath(w,h){
        
        this.path = new Path2D();

        this.path.ellipse(0, 0, w, h, 0, 0, 2 * Math.PI);
        this.path.closePath();
    }

    hitTest(x,y,tr){
        /** 
         * questa cosa mi permette di evitare id moltiplicare tutti i punti del path per la matrice di trasformazione
         * dell'elemento e moltiplicare invece solo il punto di cui voglio fare il test
        */
        let t = math.multiply( math.inv(math.multiply(tr,this.getTransformation())), [x,y,1]);
        ctx.save();
        ctx.setTransform(1,0,0,1,0,0);

        //ctx.stroke(this.path)
        let tx = math.subset(t, math.index(0) )
        let ty = math.subset(t, math.index(1) )
        let ret = ctx.isPointInPath(this.path, tx, ty)   
        ctx.restore();
        return ret; 
    }

    draw(parentT) {

        if (!this.img) {
            //console.log("aaaa")
            let offsecren_canvas = document.createElement('canvas');

            let os_ctx = offsecren_canvas.getContext('2d');

           
            offsecren_canvas.width = this.width * 2
            offsecren_canvas.height = this.height * 2

            os_ctx.translate( this.width , this.height)  
            
            os_ctx.lineWidth = 0;
            os_ctx.strokeStyle = "red";
            os_ctx.fillStyle = "red";
            os_ctx.fill(this.path);
            //os_ctx.stroke(this.path);

            //chace image for future paint

            this.img = new Image();
            this.img.onload = ()=>{
                this.postload(parentT);
            }
            this.img.src = offsecren_canvas.toDataURL("image/png");
        } else {
            this.postload(parentT);
        }
    }

    postload(parentT) {
        
        ctx.save();

        let ts = math.multiply(parentT, this.transformation);

        ctx.setTransform(
            math.subset(ts, math.index(0, 0)),
            math.subset(ts, math.index(1, 0)),
            math.subset(ts, math.index(0, 1)),
            math.subset(ts, math.index(1, 1)),
            math.subset(ts, math.index(0, 2)),
            math.subset(ts, math.index(1, 2))
        )

        ctx.drawImage(
            this.img,
            0,
            0,
            this.img.width,
            this.img.height,
            /**nel caso in cui la nuvola di punto copra più quadranti devo effetturare una traslazione del disegno */
            -this.width,
            -this.height,
            this.img.width,
            this.img.height
        );
        ctx.restore();
    }
}