'use strict'

class Grid {
    constructor() {
        this.snapSize = 0;
        this.pointSizeRatio = 0.03
        this.transformation = math.identity(3, 3)
        this.img = new Image();
        this.pattern = null;
    }

    snap(s) {
        if (s && typeof s == 'number') {
            this.snapSize = math.abs(s);
        }
        return this.snapSize
    }


    draw(ctx, w, h, c, world) {
        if (!ctx instanceof CanvasRenderingContext2D) {
            throw "invalid arguments"
        }
        if (!this.c) {

            ctx.save()
            ctx.beginPath();
            ctx.rect(0, 0, this.snapSize, this.snapSize);
            ctx.closePath()
            ctx.clip()

            let min_canvas_size = math.min(w, h)
            c.width = c.height = min_canvas_size
            let scale_factor = min_canvas_size / this.snapSize;
            ctx.setTransform(scale_factor, 0, 0, scale_factor, 0, 0);

            this.c = new Path2D()

            for (let i = 0, ii = 0; ii < 2; i += this.snapSize, ii++) {
                for (let j = 0, jj = 0; jj < 2; j += this.snapSize, jj++) {
                    let r = this.snapSize * this.pointSizeRatio;
                    let a = new Path2D("M" + (i - r) + "," + j + "a" + r + "," + r + " 0 1,0 " + (2 * r) + ",0a" + r + "," + r + " 0 1,0 -" + (2 * r) + ",0")
                    this.c.addPath(a)
                }
            }
            ctx.fillStyle = 'black'
            ctx.fill(this.c)
            this.img.onload = (e => {
                this.pattern = ctx.createPattern(this.img, 'repeat');
                this.scale_factor = this.snapSize / this.img.width;
                this.ratio = this.snapSize * this.pointSizeRatio * 2
            })
            this.img.src = c.toDataURL("image/png");
            c.width = w
            c.height = h
            ctx.restore()

        } else {

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, w, h);

            if (world.scale_factor.x * this.ratio > 1) {
                let tm = math.multiply(world.getTransformation, math.matrix([[this.scale_factor, 0, 0], [0, this.scale_factor, 0], [0, 0, 1]]));
                this.setTransformation(ctx, tm)

                let bound = math.multiply(math.inv(tm), [[0, w, w, 0], [0, 0, h, h], [1, 1, 1, 1]]).valueOf()
                let minx = math.min(bound[0][0], bound[0][1], bound[0][2], bound[0][3])
                let miny = math.min(bound[1][0], bound[1][1], bound[1][2], bound[1][3])
                let maxx = math.max(bound[0][0], bound[0][1], bound[0][2], bound[0][3])
                let maxy = math.max(bound[1][0], bound[1][1], bound[1][2], bound[1][3])

                ctx.fillStyle = this.pattern;
                ctx.fillRect(minx, miny, maxx - minx, maxy - miny);
            }


        }

    }

    setTransformation(...args) {
        if (args.length == 2 && args[1].type == 'DenseMatrix' && args[0] instanceof CanvasRenderingContext2D) {
            this.transformation = math.clone(args[1])
            let ts = args[1].valueOf()
            args[0].setTransform(
                ts[0][0],
                ts[1][0],
                ts[0][1],
                ts[1][1],
                ts[0][2],
                ts[1][2]
            )
        } else if (args.length == 7 &&
            args[0] instanceof CanvasRenderingContext2D &&
            typeof args[1] == 'number' &&
            typeof args[2] == 'number' &&
            typeof args[3] == 'number' &&
            typeof args[4] == 'number' &&
            typeof args[5] == 'number' &&
            typeof args[6] == 'number') {
            this.transformation = math.matrix(
                [args[1], args[3], args[5]],
                [args[2], args[4], args[6]],
                [0, 0, 1]
            )
            args[0].setTransform(
                args[1],
                args[2],
                args[3],
                args[4],
                args[5],
                args[6]
            )
        } else {
            throw "Invalid arguments"
        }
    }

}