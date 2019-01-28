'use strict'

class Polygon extends Element {
    constructor(obj) {
        super();
        this.vertices = (obj && obj.vertices && obj.vertices instanceof Array) ? obj.vertices : [];
        this.img = null;
        this.minx = Infinity;
        this.miny = Infinity;
        this.maxx = -Infinity;
        this.maxy = -Infinity;
    }

    hitTest(x,y,tr){
        //x e y coordinate dell'evento, quindi relative al canvas
        let t = math.multiply(tr ,this.getTransformation())

        let p = math.multiply(math.inv(t), [x,y,1])
        
        let px = math.subset(p, math.index(0))
        let py = math.subset(p, math.index(1))

        if( px >= this.minx && px <= this.maxx && py >= this.miny && py <= this.maxy){
            return true
        }
        return false;
    }

    draw(parentT) {

        if (!this.img) {
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

            os_ctx.beginPath();
            os_ctx.lineWidth = 0;
            os_ctx.strokeStyle = "green";
            let len = this.vertices.length;

            this.vertices.forEach((e, i) => {
                //console.log(e,i)
                if (!i) {
                    os_ctx.moveTo(e[0], e[1]);
                }
                os_ctx.lineTo(this.vertices[(i + 1) % len][0], this.vertices[(i + 1) % len][1]);
            });
            os_ctx.fillStyle = "green";
            os_ctx.closePath();
            os_ctx.fill();
            os_ctx.stroke();

            this.img = new Image();
            this.img.src = offsecren_canvas.toDataURL("image/png")
        }

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
            0,                      //clip start x
            0,                      //clip start y
            this.img.width-0,         //clip width
            this.img.height-0,        //clip height
            0,//-this.center.x+0,
            0,//-this.center.y+0,
            this.img.width-0,
            this.img.height-0
        );
        ctx.restore();
    }

}