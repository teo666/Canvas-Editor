'use strict'

class Bezier extends Element {
    constructor(...args) {
        super();
        this.lineWidth = 20;
        this.lineDash = [];
        this.lineCap = CanvasStyle.lineCap.Round
        this.lineJoin = CanvasStyle.lineJoin.Round
        this.strokeStyle = '#faba11'
        this.shadowColor = Colors.HTMLColor.red;
        this.globalCompositeOperation = CanvasStyle.globalCompositeOperation.source_over
        this.shadowBlur = 0;

        this.controlPoint1 = new Point2D()
        let a = new Handle(this.controlPoint1)
        a.postChange = function () {

        }.bind(this)
        a.parent(this)
        this.controls.add(a)

        this.controlPoint2 = new Point2D()
        a = new Handle(this.controlPoint2)
        a.postChange = function () {

        }.bind(this)
        a.parent(this)
        this.controls.add(a)

        this.controlPoint3 = new Point2D()
        a = new Handle(this.controlPoint3)
        a.postChange = function () {

        }.bind(this)
        a.parent(this)
        this.controls.add(a)

        this.controlPoint4 = new Point2D()
        a = new Handle(this.controlPoint4)
        a.postChange = function () {

        }.bind(this)
        a.parent(this)
        this.controls.add(a)

        if (args.length) {
            this.value(...args)
        }
    }

    value(...args) {
        if (args.length == 4 &&
            args[0] instanceof Point2D &&
            args[1] instanceof Point2D &&
            args[2] instanceof Point2D &&
            args[3] instanceof Point2D) {
            this.controlPoint1.value(args[0])
            this.controlPoint2.value(args[1])
            this.controlPoint3.value(args[2])
            this.controlPoint4.value(args[3])
            this.buildPath()
        }
    }

    width(w) {
        if (typeof w == 'number' && w >= 0) {
            this.lineWidth = w
        }
        return this.lineWidth
    }

    controlPoint(n, ...args) {
        if (typeof n == 'number' && n > 0 && n <= 4) {
            if (args.length) {
                this['controlPoint' + n].value(...args)
                this.buildPath()
            }
            return this['controlPoint' + n]
        }
    }

    buildPath() {
        //console.log("anche uqui")
        this.path = new Path2D();
        this.path.moveTo(this.controlPoint1.x(), this.controlPoint1.y())

        this.path.bezierCurveTo(
            this.controlPoint2.x(), this.controlPoint2.y(),
            this.controlPoint3.x(), this.controlPoint3.y(),
            this.controlPoint4.x(), this.controlPoint4.y(),
        );
        this.buildHitTestPath()

    }

    buildHitTestPath() {
        //WARN: this method is an aproximation of real bezier path
        this.hitPath = new Path2D();
        const w = this.lineWidth / 2

        this.hitPath.moveTo(this.controlPoint1.x() - w, this.controlPoint1.y() - w)

        this.hitPath.bezierCurveTo(
            this.controlPoint2.x() - w, this.controlPoint2.y() - w,
            this.controlPoint3.x() - w, this.controlPoint3.y() - w,
            this.controlPoint4.x() - w, this.controlPoint4.y() - w,
        );
        this.hitPath.lineTo(this.controlPoint4.x() + w, this.controlPoint4.y() + w)

        this.hitPath.bezierCurveTo(
            this.controlPoint3.x() + w, this.controlPoint3.y() + w,
            this.controlPoint2.x() + w, this.controlPoint2.y() + w,
            this.controlPoint1.x() + w, this.controlPoint1.y() + w,
        );
        this.hitPath.closePath()

    }

    hitTest(x, y, tr, contextes) {
        /** 
         * questa cosa mi permette di evitare id moltiplicare tutti i punti del path per la matrice di trasformazione
         * dell'elemento e moltiplicare invece solo il punto di cui voglio fare il test
        */
        let t = TransformationMatrix.multiply(tr, this.getTransformation()).inv().multiplyPoint(x, y)
        contextes.fg.save();
        contextes.fg.setTransform(1, 0, 0, 1, 0, 0);

        let ret = contextes.fg.isPointInPath(this.path, t[0], t[1])
        contextes.fg.restore();
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
            ctx.strokeStyle = this.strokeStyle
            ctx.lineWidth = this.lineWidth
            ctx.lineCap = this.lineCap
            ctx.lineJoin = this.lineJoin
            ctx.setLineDash(this.lineDash)
            ctx.shadowBlur = this.shadowBlur
            ctx.shadowColor = this.shadowColor
            ctx.stroke(this.path)

            //DEBUG: draw hitTestPath

            contextes.fg.strokeStyle = 'yellow'
            contextes.fg.lineWidth = 1
            contextes.fg.stroke(this.hitPath)


            ctx.restore();
            super.draw(contextes, null, t)
        }
    }

}