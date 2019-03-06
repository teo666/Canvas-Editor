'use strict'

class Ellipse extends Element {
    constructor(...args) {
        super();
        this.path = null;
        this.lineWidth = 10;
        this.lineDash = [];
        this.strokeStyle = 'black'
        this.fillStyle = '#00000000'

        this.centerPoint = new Point2D(0, 0);
        this.radiusSize = new Size2D(0, 0);
        this.rotationNumber = 0;
        if (args.length) this.value(...args)

    }

    value(...args) {
        if (args.length == 1 && args[0] instanceof Ellipse) {
            this.center(args[0].center())
            this.radius(args[0].radius())
            this.rotation(args[0].rotation())
        } else if (args.length == 3) {
            this.center(args[0])
            this.radius(args[1])
            this.rotation(args[2])
        } else {
            throw "Invalid arguments"
        }
        this.buildPath()
    }

    center(...args) {
        if (args.length == 1 && args[0] instanceof Point2D) {
            this.centerPoint.value(args[0])
        } else if (args.length == 2 && typeof args[0] == 'number' && typeof args[1] == 'number') {
            this.centerPoint.x(args[0])
            this.centerPoint.y(args[1])
        }
        return this.centerPoint;
    }

    radius(...args) {
        if (args.length == 1 && args[0] instanceof Size2D) {
            this.radiusSize.w(args[0].w())
            this.radiusSize.h(args[0].h())
        }
        return this.radiusSize;
    }

    rotation(...args) {
        if (args.length == 1 && typeof args[0] == 'number') {
            this.rotationNumber = args[0]
        }
        return this.rotationNumber
    }

    get getCenterSHALLOW() {
        return this.center;
    }

    transformedCenter() {
        return new Point2D(math.multiply(this.transformation, this.center.point3).valueOf())
    }

    setCenter(c) {
        this.center = c.clone();
    }

    buildPath() {
        this.path = new Path2D();
        this.path.ellipse(this.centerPoint.x(), this.centerPoint.y(), this.radiusSize.w(), this.radiusSize.h(), this.rotationNumber, 0, 2 * Math.PI);
    }

    hitTest(x, y, tr, context) {
        /** 
         * questa cosa mi permette di evitare id moltiplicare tutti i punti del path per la matrice di trasformazione
         * dell'elemento e moltiplicare invece solo il punto di cui voglio fare il test
        */
        let t = math.multiply(math.inv(math.multiply(tr, this.getTransformation)), [x, y, 1]);
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);

        //ctx.stroke(this.path)
        let tx = math.subset(t, math.index(0))
        let ty = math.subset(t, math.index(1))
        let ret = context.isPointInPath(this.path, tx, ty)
        context.restore();
        return ret;
    }

    draw(context, parentT) {
        if (this.enableDraw) {

            context.save();

            let ts = TransformationMatrix.multiply(parentT, this.transformation).valueOf()

            context.setTransform(
                ts[0][0],
                ts[1][0],
                ts[0][1],
                ts[1][1],
                ts[0][2],
                ts[1][2]
            )
            context.lineWidth = this.lineWidth
            //context.fillStyle = this.fillStyle
            context.strokeStyle = this.strokeStyle
            context.setLineDash(this.lineDash);
            //context.fill(this.path);
            context.stroke(this.path)

            context.restore();
        }
    }
}