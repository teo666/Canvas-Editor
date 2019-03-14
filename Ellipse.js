'use strict'

class Ellipse extends Element {
    constructor(...args) {
        super();
        this.path = null;
        this.lineWidth = 10;
        this.lineDash = [];
        this.strokeStyle = Colors.HTMLColor.rebeccapurple
        this.fillStyle = Colors.HTMLColor.rebeccapurple
        this.shadowColor = Colors.HTMLColor.red;
        this.shadowBlur = 0;
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
        if (args.length){
            this.centerPoint.value(...args)
            this.buildPath()
        }
        return this.centerPoint;
    }

    radius(...args) {
        if (args.length) {
            this.radiusSize.value(...args)
            this.buildPath()
        }
        return this.radiusSize;
    }

    rotation(...args) {
        if (args.length == 1 && typeof args[0] == 'number') {
            this.rotationNumber = args[0]
            this.buildPath()
        }
        return this.rotationNumber
    }

    buildPath() {
        this.path = new Path2D();
        this.path.ellipse(this.centerPoint.x(), this.centerPoint.y(), this.radiusSize.w(), this.radiusSize.h(), this.rotationNumber, 0, 2 * Math.PI);
    }

    hitTest(x, y, tr, context) {
        /** 
         * TODO: spostare questo metodo nella classe element (da valutare)
         * questa cosa mi permette di evitare id moltiplicare tutti i punti del path per la matrice di trasformazione
         * dell'elemento e moltiplicare invece solo il punto di cui voglio fare il test
        */
        let t = TransformationMatrix.multiply(tr, this.getTransformation()).inv().multiplyPoint(x, y).valueOf()
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);

        let ret = context.isPointInPath(this.path, t[0], t[1])
        context.restore();
        return ret;
    }

    draw(context, parentT) {
        if (this.enableDraw) {

            context.save();

            let t = TransformationMatrix.multiply(parentT, this.transformation)
            let ts = t.valueOf()
            context.setTransform(
                ts[0],
                ts[1],
                ts[2],
                ts[3],
                ts[4],
                ts[5]
            )
            context.lineWidth = this.lineWidth
            context.fillStyle = this.fillStyle
            context.strokeStyle = this.strokeStyle
            context.shadowBlur = this.shadowBlur
            context.shadowColor = this.shadowColor
            context.setLineDash(this.lineDash);
            context.stroke(this.path)
            context.fill(this.path);
            if (this.selected) {
                this.pivot.draw(context, t)
            }
            context.restore();
        }
    }
}