'use strict'

class Grid {
    constructor() {
        this.snapSize = 0;
        this.pointSizeRatio = 0.03
        this.pointRadiusSize = 0.8
        this.backgroundColor = Colors.HTMLColor.black
        this.pointColor = Colors.HTMLColor.white
        //this.transformation = new TransformationMatrix()
        //this.img = new Image();
        this.zoomPrefetchGeneration = 1.1
        this.patterns = {};
        this.patternsImageSize = 0
        this.patternRatioInterval = 0.01
        this.lowerRatio = 0.008
        this.higherRatio = 0.2
    }

    snap(s) {
        if (s && typeof s == 'number') {
            this.snapSize = Math.abs(s);
        }
        return this.snapSize
    }


    /*draw1(ctx, w, h, c, world) {
        if (!ctx instanceof CanvasRenderingContext2D) {
            throw "invalid arguments"
        }
        if (!this.path) {

            ctx.save()

            let min_canvas_size = Math.min(w, h)
            c.width = c.height = min_canvas_size
            let scale_factor = min_canvas_size / this.snapSize;
            ctx.setTransform(scale_factor, 0, 0, scale_factor, 0, 0);
            //set white background
            ctx.fillStyle = this.backgroundColor
            ctx.fillRect(0,0,c.width,c.height)

            this.path = new Path2D()

            for (let i = 0, ii = 0; ii < 2; i += this.snapSize, ii++) {
                for (let j = 0, jj = 0; jj < 2; j += this.snapSize, jj++) {
                    let r = this.snapSize * this.pointSizeRatio;
                    let a = new Path2D("M" + (i - r) + "," + j + "a" + r + "," + r + " 0 1,0 " + (2 * r) + ",0a" + r + "," + r + " 0 1,0 -" + (2 * r) + ",0")
                    this.path.addPath(a)
                }
            }
            ctx.fillStyle = 'black'
            ctx.fill(this.path)
            this.img.onload = (e => {
                this.pattern = ctx.createPattern(this.img, 'repeat');
                this.scale_factor = this.snapSize / this.img.width;
                this.ratio = this.snapSize * this.pointSizeRatio * 2
                this.draw(ctx, w, h, c, world)
            })
            this.img.src = c.toDataURL("image/png");
            c.width = w
            c.height = h
            ctx.restore()
        } else {
            //ctx.setTransform(1, 0, 0, 1, 0, 0);
            //ctx.clearRect(0, 0, w, h);
            
            if (world.getScaleFactor().x * this.ratio > 1) {
                //let tm = math.multiply(world.getTransformation, math.matrix([[this.scale_factor, 0, 0], [0, this.scale_factor, 0], [0, 0, 1]]));
                let tm = world.getTransformation().clone().scale(this.scale_factor, this.scale_factor)
                this.setTransformation(ctx, tm)

                //let bound = math.multiply(math.inv(tm), [[0, w, w, 0], [0, 0, h, h], [1, 1, 1, 1]]).valueOf()
                let bound = tm.inv().toMatrix().multiply(new Matrix(3,4).value([[0, w, w, 0], [0, 0, h, h], [1, 1, 1, 1]])).valueOf()
                let minx = Math.min(bound[0][0], bound[0][1], bound[0][2], bound[0][3])
                let miny = Math.min(bound[1][0], bound[1][1], bound[1][2], bound[1][3])
                let maxx = Math.max(bound[0][0], bound[0][1], bound[0][2], bound[0][3])
                let maxy = Math.max(bound[1][0], bound[1][1], bound[1][2], bound[1][3])

                ctx.fillStyle = this.pattern;
                ctx.fillRect(minx, miny, maxx - minx, maxy - miny);
            } else {
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, w, h);
            }
        }

    }*/

    generatePattern(c) {
        this.patternsImageSize = this.patternsImageSize ? this.patternsImageSize : Math.min(c.width, c.height)
        this.oc = new OffscreenCanvas(this.patternsImageSize, this.patternsImageSize)
        let ctx = this.oc.getContext('2d')
        ctx.fillStyle = this.backgroundColor
        ctx.fillRect(0, 0, this.patternsImageSize, this.patternsImageSize)


        for (let n = this.lowerRatio, idx = 0; n <= this.higherRatio; n += this.patternRatioInterval, idx++) {
            this.path = new Path2D()
            let r = n * this.patternsImageSize

            for (let i = 0, ii = 0; ii < 2; i += this.patternsImageSize, ii++) {
                for (let j = 0, jj = 0; jj < 2; j += this.patternsImageSize, jj++) {
                    let a = new Path2D("M" + (i - r) + "," + j + "a" + r + "," + r + " 0 1,0 " + (2 * r) + ",0a" + r + "," + r + " 0 1,0 -" + (2 * r) + ",0")
                    this.path.addPath(a)
                }
            }

            ctx.fillStyle = this.pointColor
            ctx.fill(this.path)
            this.patterns[idx] = ctx.createPattern(this.oc, "repeat")
            this.patterns[idx].ratio = n
        }
    }

    searchPattern(ratio){
        let betterIdx = 0
        let last = Infinity
        const length = Object.keys(this.patterns).length
        while( betterIdx < length && ratio > this.patterns[betterIdx].ratio ){
            betterIdx++;
        }
        return betterIdx
    }

    draw(ctx, w, h, world) {
        this.scaleFactor = this.snapSize / this.patternsImageSize;
        let tm = world.getTransformation().clone().scale(this.scaleFactor, this.scaleFactor)
        // fattore di scalatura del canvas offscren let ratio = 1 / tm.scaleFactor.x 
        let ratio = this.pointRadiusSize / (tm.scaleFactor.x  * this.patternsImageSize)
        let index = this.searchPattern(ratio)
        
        console.log(index)
        this.setTransformation(ctx, tm)
        let bound = tm.inv().toMatrix().multiply(new Matrix(3, 4).value([[0, w, w, 0], [0, 0, h, h], [1, 1, 1, 1]])).valueOf()
        let minx = Math.min(bound[0][0], bound[0][1], bound[0][2], bound[0][3])
        let miny = Math.min(bound[1][0], bound[1][1], bound[1][2], bound[1][3])
        let maxx = Math.max(bound[0][0], bound[0][1], bound[0][2], bound[0][3])
        let maxy = Math.max(bound[1][0], bound[1][1], bound[1][2], bound[1][3])

        ctx.fillStyle = this.patterns[index]
        ctx.fillRect(minx, miny, maxx - minx, maxy - miny);
    }

    /*prefetch(ctx, w, h, c, world) {
        this.min_canvas_size = Math.min(w, h)
        this.scaleFactor = this.snapSize / this.min_canvas_size;
        let fake_world = world.getTransformation().clone()
        for (let i = 0; i < 50; i++) {
            fake_world.scale(this.zoomPrefetchGeneration, this.zoomPrefetchGeneration)

            let tm = fake_world.clone().scale(this.scaleFactor, this.scaleFactor)

            let index = Math.trunc(fake_world.scaleFactor.x * 10)
            this.generateImage(ctx, w, h, c, fake_world, tm, index)
        }

        fake_world = world.getTransformation().clone()
        const sf = 1 / this.zoomPrefetchGeneration
        for (let i = 0; i < 50; i++) {
            fake_world.scale(sf, sf)

            let tm = fake_world.clone().scale(this.scaleFactor, this.scaleFactor)

            let index = Math.trunc(fake_world.scaleFactor.x * 10)
            this.generateImage(ctx, w, h, c, fake_world, tm, index)
        }
    }

    drawGrid(ctx, w, h, tm, index) {
        this.setTransformation(ctx, tm)
        let bound = tm.inv().toMatrix().multiply(new Matrix(3, 4).value([[0, w, w, 0], [0, 0, h, h], [1, 1, 1, 1]])).valueOf()
        let minx = Math.min(bound[0][0], bound[0][1], bound[0][2], bound[0][3])
        let miny = Math.min(bound[1][0], bound[1][1], bound[1][2], bound[1][3])
        let maxx = Math.max(bound[0][0], bound[0][1], bound[0][2], bound[0][3])
        let maxy = Math.max(bound[1][0], bound[1][1], bound[1][2], bound[1][3])

        ctx.fillStyle = this.patterns[index].pattern
        ctx.fillRect(minx, miny, maxx - minx, maxy - miny);
        if (this.patterns[index].pattern) delete this.patterns[index].img
    }

    generatePatternsCompatibility(ctx, w, h, c, world, tm, index) {
        ctx.save()
        c.width = c.height = this.min_canvas_size
        let _1_scale_factor = this.min_canvas_size / this.snapSize;

        ctx.setTransform(_1_scale_factor, 0, 0, _1_scale_factor, 0, 0);
        //set background colors
        ctx.fillStyle = this.backgroundColor
        ctx.fillRect(0, 0, c.width, c.height)

        let r = this.pointRadiusSize / tm.scaleFactor.x / _1_scale_factor
        this.path = new Path2D()

        for (let i = 0, ii = 0; ii < 2; i += this.snapSize, ii++) {
            for (let j = 0, jj = 0; jj < 2; j += this.snapSize, jj++) {
                let a = new Path2D("M" + (i - r) + "," + j + "a" + r + "," + r + " 0 1,0 " + (2 * r) + ",0a" + r + "," + r + " 0 1,0 -" + (2 * r) + ",0")
                this.path.addPath(a)
            }
        }

        ctx.fillStyle = this.pointColor
        ctx.fill(this.path)
        this.patterns[index] = {}

        this.patterns[index].img = new Image()
        this.patterns[index].img.index = index
        this.patterns[index].img.onload = (e => {
            this.patterns[e.target.index].pattern = ctx.createPattern(this.patterns[e.target.index].img, 'repeat');
        })
        this.patterns[index].img.src = c.toDataURL("image/png");
        c.width = w
        c.height = h
        ctx.restore()
    }

    draw(ctx, w, h, c, world) {
        if (!ctx instanceof CanvasRenderingContext2D) {
            throw "invalid arguments"
        }

        this.min_canvas_size = Math.min(c.width, c.height)
        this.scaleFactor = this.snapSize / this.min_canvas_size;
        let tm = world.getTransformation().clone().scale(this.scaleFactor, this.scaleFactor)

        let index = Math.trunc(world.getTransformation().scaleFactor.x * 10)

        if (this.patterns[index]) {
            this.drawGrid(ctx, w, h, tm, index)
        } else {
            this.generatePatternsCompatibility(ctx, w, h, c, world, tm, index)
        }

    }*/

    setTransformation(...args) {
        if (args.length == 2 && args[1] instanceof TransformationMatrix && args[0] instanceof CanvasRenderingContext2D) {
            this.transformation = args[1].clone()
            let ts = args[1].valueOf()
            args[0].setTransform(
                ts[0],
                ts[1],
                ts[2],
                ts[3],
                ts[4],
                ts[5]
            )
        } else {
            throw "Invalid arguments"
        }
    }

}