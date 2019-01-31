'use strict'

class Polygon extends Element {
    constructor(obj) {
        super();
        this.vertices = (obj && obj.vertices && obj.vertices instanceof Array) ? obj.vertices : [];
        this.buildPath();
        this.img = null;
        this.minx = Infinity;
        this.miny = Infinity;
        this.maxx = -Infinity;
        this.maxy = -Infinity;
    }

    buildPath(){
        let len = this.vertices.length;
        this.path = new Path2D();

        this.vertices.forEach((e, i) => {
            if (!i) {
                this.path.moveTo(e[0], e[1]);
            }
            this.path.lineTo(this.vertices[(i + 1) % len][0], this.vertices[(i + 1) % len][1]);
        });
        this.path.closePath();
    }

    hitTest(x,y,tr){
        let t = math.multiply( math.inv(math.multiply(tr,this.getTransformation())), [x,y,1]);
        ctx.save();
        ctx.setTransform(1,0,0,1,0,0);

        ctx.stroke(this.path)
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

            this.vertices.forEach((e, i) => {
                if (e[0] < this.minx) this.minx = e[0];
                if (e[1] < this.miny) this.miny = e[1];
                if (e[0] > this.maxx) this.maxx = e[0];
                if (e[1] > this.maxy) this.maxy = e[1];
            });
            offsecren_canvas.width = this.maxx - this.minx
            offsecren_canvas.height = this.maxy - this.miny

            os_ctx.translate( (this.minx < 0) ? math.abs(this.minx) : 0, (this.miny < 0) ? math.abs(this.miny) : 0)  
            
            os_ctx.lineWidth = 0;
            os_ctx.strokeStyle = "red";
            os_ctx.fillStyle = "green";
            os_ctx.fill(this.path);
            os_ctx.stroke(this.path);

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
            this.minx,
            this.miny,
            this.img.width,
            this.img.height
        );
        ctx.restore();
    }

}