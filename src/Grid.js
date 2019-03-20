'use strict'

class Grid {
    constructor() {
        //TODO: replace all grid with a div and transform with css
        this.snapSize = 0;
        this.pointSizeRatio = 0.03
        this.pointRadiusSize = 0.8
        this.backgroundColor = Colors.HTMLColor.black
        this.pointColor = Colors.HTMLColor.grey
        //this.transformation = new TransformationMatrix()
        //this.img = new Image();
        this.zoomPrefetchGeneration = 1.1
        this.patterns = {};
        this.patternsCompatibility = {};
        this.patternsImageSize = 700
        this.patternRatioInterval = 0.001
        this.lowerRatio = 0.005
        this.higherRatio = 0.08
        this.lastScaleFactor = NaN
        this.pointshapeType = 0
        this.lastFillStyle = this.backgroundColor
        this.enable = true
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

    prefetchPatternsCompatibility(ctx, c, world) {
        this.minCanvasSize = Math.min(c.width, c.height)
        this.scaleFactor = this.snapSize / this.minCanvasSize;
        let fake_world = world.getTransformation().clone()
        for (let i = 0; i < 50; i++) {
            fake_world.scale(this.zoomPrefetchGeneration, this.zoomPrefetchGeneration)

            let tm = fake_world.clone().scale(this.scaleFactor, this.scaleFactor)

            let index = Math.trunc(fake_world.scaleFactor.x * 10)
            this.generatePatternsCompatibility(ctx, c, c.width, c.height, tm, index)
        }

        fake_world = world.getTransformation().clone()
        const sf = 1 / this.zoomPrefetchGeneration
        for (let i = 0; i < 50; i++) {
            fake_world.scale(sf, sf)

            let tm = fake_world.clone().scale(this.scaleFactor, this.scaleFactor)

            let index = Math.trunc(fake_world.scaleFactor.x * 10)
            this.generatePatternsCompatibility(ctx, c, c.width, c.height, tm, index)
        }
    }

    prefetchPatterns() {
        this.oc = new OffscreenCanvas(this.patternsImageSize, this.patternsImageSize)
        let ctx = this.oc.getContext('2d')
        ctx.fillStyle = this.backgroundColor
        ctx.fillRect(0, 0, this.patternsImageSize, this.patternsImageSize)


        for (let n = this.lowerRatio, idx = 0; n <= this.higherRatio; n += this.patternRatioInterval, idx++) {
            this.path = new Path2D()
            let r = n * this.patternsImageSize

            if (this.pointshapeType) {
                for (let i = 0, ii = 0; ii < 2; i += this.patternsImageSize, ii++) {
                    for (let j = 0, jj = 0; jj < 2; j += this.patternsImageSize, jj++) {
                        let a = new Path2D("M" + (i - r) + "," + j + "a" + r + "," + r + " 0 1,0 " + (2 * r) + ",0a" + r + "," + r + " 0 1,0 -" + (2 * r) + ",0")
                        this.path.addPath(a)
                    }
                }
            } else {
                this.path.rect(0, 0, r, r)
                this.path.rect(0, this.patternsImageSize - r, r, r)
                this.path.rect(this.patternsImageSize - r, 0, r, r)
                this.path.rect(this.patternsImageSize - r, this.patternsImageSize - r, r, r)
            }

            ctx.fillStyle = this.pointColor
            ctx.fill(this.path)
            this.patterns[idx] = ctx.createPattern(this.oc, "repeat")
            this.patterns[idx].ratio = n
        }
    }

    searchPattern(ratio) {
        let betterIdx = 0
        const length = Object.keys(this.patterns).length
        while (betterIdx < length && ratio > this.patterns[betterIdx].ratio) {
            betterIdx++;
        }
        if (betterIdx == length) return this.backgroundColor
        return this.patterns[betterIdx]
    }

    prefetch(ctx, c, world) {
        try {
            this.prefetchPatterns()
            //TODO: convertire con oggetto e proprieta
            this.operationMode = 0
            } catch (e) {
            this.prefetchPatternsCompatibility(ctx, c, world)
            this.operationMode = 1
        }
    }

    drawGridCompatibility(ctx, w, h, tm, index) {
        this.setTransformation(ctx, tm)
        let bound = tm.inv().toMatrix().multiply(new Matrix(3, 4).value([[0, w, w, 0], [0, 0, h, h], [1, 1, 1, 1]])).valueOf()
        let minx = Math.min(bound[0][0], bound[0][1], bound[0][2], bound[0][3])
        let miny = Math.min(bound[1][0], bound[1][1], bound[1][2], bound[1][3])
        let maxx = Math.max(bound[0][0], bound[0][1], bound[0][2], bound[0][3])
        let maxy = Math.max(bound[1][0], bound[1][1], bound[1][2], bound[1][3])

        ctx.fillStyle = this.patternsCompatibility[index].pattern
        ctx.fillRect(minx, miny, maxx - minx, maxy - miny);
        if (this.patternsCompatibility[index].pattern) delete this.patternsCompatibility[index].img
    }

    drawGrid(ctx, w, h, world) {
        this.scaleFactor = this.snapSize / this.patternsImageSize;
        let tm = world.getTransformation().clone().scale(this.scaleFactor, this.scaleFactor)
        // fattore di scalatura del canvas offscren let ratio = 1 / tm.scaleFactor.x 
        if(!this.enable){
            this.lastFillStyle = this.backgroundColor
            this.modified = true
            this.lastScaleFactor = null
        } else if (this.lastScaleFactor != tm.scaleFactor.x) {
            //let ratio = this.pointRadiusSize / (tm.scaleFactor.x  * this.patternsImageSize)
            this.lastScaleFactor = tm.scaleFactor.x
            this.lastFillStyle = this.searchPattern(this.pointRadiusSize / (tm.scaleFactor.x * this.patternsImageSize))
        }

        this.setTransformation(ctx, tm)
        let bound = tm.inv().toMatrix().multiply(new Matrix(3, 4).value([[0, w, w, 0], [0, 0, h, h], [1, 1, 1, 1]])).valueOf()
        let minx = Math.min(bound[0][0], bound[0][1], bound[0][2], bound[0][3])
        let miny = Math.min(bound[1][0], bound[1][1], bound[1][2], bound[1][3])
        let maxx = Math.max(bound[0][0], bound[0][1], bound[0][2], bound[0][3])
        let maxy = Math.max(bound[1][0], bound[1][1], bound[1][2], bound[1][3])
        ctx.fillStyle = this.lastFillStyle
        ctx.fillRect(minx, miny, maxx - minx, maxy - miny);
    }

    generatePatternsCompatibility(ctx, c, w, h, tm, index) {
        ctx.save()
        c.width = c.height = this.minCanvasSize
        let _1_scale_factor = this.minCanvasSize / this.snapSize;

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
        this.patternsCompatibility[index] = {}

        this.patternsCompatibility[index].img = new Image()
        this.patternsCompatibility[index].img.index = index
        this.patternsCompatibility[index].img.onload = (e => {
            this.patternsCompatibility[e.target.index].pattern = ctx.createPattern(this.patternsCompatibility[e.target.index].img, 'repeat');
        })
        this.patternsCompatibility[index].img.src = c.toDataURL("image/png");
        c.width = w
        c.height = h
        ctx.restore()
    }

    drawCompatibility(ctx, c, world) {
        const w = c.width
        const h = c.height
        this.minCanvasSize = this.minCanvasSize ? this.minCanvasSize : Math.min(w, h)
        this.scaleFactor = this.snapSize / this.minCanvasSize;
        let tm = world.getTransformation().clone().scale(this.scaleFactor, this.scaleFactor)

        let index = Math.trunc(world.getTransformation().scaleFactor.x * 10)

        if (this.patternsCompatibility[index]) {
            this.drawGridCompatibility(ctx, w, h, tm, index)
        } else {
            this.generatePatternsCompatibility(ctx, c, w, h, tm, index)
        }

    }

    draw(ctx, c, world){
        ctx.save()
        if(this.operationMode){
            this.drawCompatibility(ctx, c, world)
        } else {
            this.drawGrid(ctx, c.width, c.height, world)
        }
        ctx.restore()
    }

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