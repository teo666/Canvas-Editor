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
        this.loadP = new Promise();
    }

    buildPath(){
        let len = this.vertices.length;
        this.path = new Path2D();
        let tt = this.getTransformation()
        let transformed_path = this.vertices.map(function(v){
            let tmp =  math.multiply(tt, math.concat(v, [1]))
            //console.log(math.resize(tmp,[2])._data)
            return math.resize(tmp,[2])._data
        });
        transformed_path.forEach((e, i) => {
            if (!i) {
                this.path.moveTo(e[0], e[1]);
            }
            this.path.lineTo(transformed_path[(i + 1) % len][0], transformed_path[(i + 1) % len][1]);
        });
        this.path.closePath();
    }

    hitTest(x,y,tr){
        this.buildPath()
        return ctx.isPointInPath(this.path, x, y)   
    }

    draw(parentT) {

        if (!this.img) {
            console.log("aaaa")
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

            //console.log(os_ctx.isPointInPath(this.path, 20,20))

            this.img = new Image();
            this.img.src = offsecren_canvas.toDataURL("image/png");
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
            0,
            0,
            this.img.width,
            this.img.height,
            0,
            0,
            this.img.width,
            this.img.height
        );
        ctx.restore();
    }

}