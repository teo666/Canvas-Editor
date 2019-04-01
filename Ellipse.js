'use strict'

class Ellipse extends Element {
    constructor(...args) {
        super();
        this.path = null;
        this.lineWidth = 10;
        this.lineDash = [];
        this.strokeStyle = Colors.HTMLColor.orange
        this.fillStyle = Colors.HTMLColor.green
        this.shadowColor = Colors.HTMLColor.red;
        this.globalCompositeOperation = CanvasStyle.globalCompositeOperation.source_over
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

    width(...args) {
        if (args.length == 1) {
            if (typeof args[0] == 'number') {
                this.lineWidth = args[0]
                this.buildPath()
            } else {
                throw 'Invalid arguments'
            }
        }
        return this.lineWidth;
    }

    center(...args) {
        if (args.length) {
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
        this.buildHitTestPath()
    }

    buildHitTestPath() {
        const w = this.lineWidth / 2
        this.hitPath = new Path2D();
        this.hitPath.ellipse(this.centerPoint.x(), this.centerPoint.y(), this.radiusSize.w() + w, this.radiusSize.h() + w, this.rotationNumber, 0, 2 * Math.PI);
    }

    hitTest(x, y, tr, contextes) {
        /** 
         * TODO: spostare questo metodo nella classe element (da valutare)
         * questa cosa mi permette di evitare id moltiplicare tutti i punti del path per la matrice di trasformazione
         * dell'elemento e moltiplicare invece solo il punto di cui voglio fare il test
        */
        let t = TransformationMatrix.multiply(tr, this.getTransformation()).inv().multiplyPoint(x, y).valueOf()
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        let ret = ctx.isPointInPath(this.path, t[0], t[1])
        ctx.restore();
        return ret;
    }

    draw(contextes, parentT) {
        if (this.enableDraw) {

            let ctx = contextes.data
            if (this.add()) {
                ctx = contextes.fg
            }

            ctx.save();

            let t = TransformationMatrix.multiply(parentT, this.transformation)
            let ts = t.valueOf()
            ctx.setTransform(
                ts[0],
                ts[1],
                ts[2],
                ts[3],
                ts[4],
                ts[5]
            )
            ctx.globalCompositeOperation = this.globalCompositeOperation
            ctx.lineWidth = this.lineWidth
            ctx.fillStyle = this.fillStyle
            ctx.strokeStyle = this.strokeStyle
            ctx.shadowBlur = this.shadowBlur
            ctx.shadowColor = this.shadowColor
            ctx.setLineDash(this.lineDash);
            ctx.fill(this.path);
            if (this.lineWidth) {
                ctx.stroke(this.path)
            }

            /*context.strokeStyle = 'red'
            context.lineWidth = 1
            context.stroke(this.hitPath)*/

            ctx.restore();
            super.draw(contextes, null, t)
        }
    }
}