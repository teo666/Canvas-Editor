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
        let a = new Handle(this.centerPoint)
        a.shape = Handle.shape.cross
        a.onChange = function () {
            //TODO:
        }.bind(this)

        a.parent(this)
        this.controls.add(a)

        this.widthPoint = new Point2D(0, 0)
        a = new Handle(this.widthPoint)
        a.onChange = function () {
            this.widthPoint.h(this.center().h())
            let diff = Math.abs(this.widthPoint.w() - this.centerPoint.w())
            this.widthPoint.w(this.center().w() - diff)
        }.bind(this)

        a.parent(this)
        a.shape = Handle.shape.square
        this.controls.add(a)

        this.heightPoint = new Point2D(0, 0)
        a = new Handle(this.heightPoint)
        a.onChange = function () {
            this.heightPoint.w(this.center().w())
            let diff = Math.abs(this.heightPoint.h() - this.centerPoint.h())
            this.heightPoint.h(this.center().h() - diff)
        }.bind(this)

        a.parent(this)
        a.shape = Handle.shape.square
        this.controls.add(a)

        this.startPoint = new Point2D(0, 0)
        a = new Handle(this.startPoint)
        a.parent(this)
        this.controls.add(a)

        this.endPoint = new Point2D(0, 0)
        a = new Handle(this.endPoint)
        a.parent(this)
        this.controls.add(a)

        this.buildPath()

        this.rotationNumber = 0;
        if (args.length) this.value(...args)

    }

    constraints() {
        //constraint height
        this.heightPoint.w(this.center().w())
        let diff = Math.abs(this.heightPoint.h() - this.centerPoint.h())
        this.heightPoint.h(this.center().h() - diff)
        //constraint width
        this.widthPoint.h(this.center().h())
        diff = Math.abs(this.widthPoint.w() - this.centerPoint.w())
        this.widthPoint.w(this.center().w() - diff)
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

    lineWidth(...args) {
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

    controlWidth(...args) {
        if (args.length && typeof args[0] == 'number') {
            this.widthPoint.w(args[0])
            this.widthPoint.h(this.center().h())
            this.buildPath();
        }
        return this.widthPoint.w()
    }

    controlHeight(...args) {
        if (args.length && typeof args[0] == 'number') {
            this.heightPoint.h(args[0])
            this.heightPoint.w(this.center().w())
            this.buildPath();
        }
        return this.heightPoint.h()
    }

    center(...args) {
        if (args.length) {
            this.centerPoint.value(...args)
            //this.heightPoint.w(this.center().w())
            //this.widthPoint.h(this.center().h())
            this.constraints()
            this.buildPath()
        }
        return this.centerPoint;
    }

    start(...args) {
        if (args.length) {
            this.startPoint.value(...args)
            this.buildPath()
        }
        return this.startPoint
    }

    end(...args) {
        if (args.length) {
            this.endPoint.value(...args)
            this.buildPath()
        }
        return this.endPoint
    }

    radius(...args) {
        if (args.length == 2 && typeof args[0] == 'number' && typeof args[1] == 'number') {
            this.controlWidth(args[0])
            this.controlHeight(args[1])
        }
        return new Size2D(this.controlWidth() - this.center().x(), this.controlHeight() - this.center().y()).abs()
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
        const startAngle = Point2D.angle(this.center(), this.start())
        let endAngle = Point2D.angle(this.center(), this.end())
        if (startAngle == endAngle) {
            endAngle = startAngle + Math.PI * 2
        }
        this.path.ellipse(this.centerPoint.x(), this.centerPoint.y(), this.radius().x(), this.radius().y(), this.rotationNumber, startAngle, endAngle);
        this.buildHitTestPath()
    }

    buildHitTestPath() {
        const w = this.lineWidth / 2
        this.hitPath = new Path2D();
        this.hitPath.ellipse(this.centerPoint.x(), this.centerPoint.y(), this.radius().x() + w, this.radius().y() + w, this.rotationNumber, 0, 2 * Math.PI);
    }

    hitTest(x, y, tr, contextes) {
        /** 
         * TODO: spostare questo metodo nella classe element (da valutare)
         * questa cosa mi permette di evitare id moltiplicare tutti i punti del path per la matrice di trasformazione
         * dell'elemento e moltiplicare invece solo il punto di cui voglio fare il test
        */
        let t = TransformationMatrix.multiply(tr, this.getTransformation()).inv().multiplyPoint(x, y).valueOf()
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
            ctx.lineWidth = this.lineWidth
            ctx.fillStyle = this.fillStyle
            ctx.strokeStyle = this.strokeStyle
            ctx.shadowBlur = this.shadowBlur
            ctx.shadowColor = this.shadowColor
            ctx.lineCap = this.lineCap
            ctx.lineJoin = this.lineJoin
            ctx.setLineDash(this.lineDash);
            ctx.fill(this.path);
            if (this.lineWidth) {
                ctx.stroke(this.path)
            }

            /*context.strokeStyle = 'red'
            context.lineWidth = 1
            context.stroke(this.hitPath)*/
            if (this.selected) this.edit(contextes)
            ctx.restore();
            super.draw(contextes, null, t)
        }
    }

    edit(contextes) {
        const ctx = contextes.fg
        const tm = TransformationMatrix.multiply(this.getParentsTransformations(), this.getTransformation()).valueOf()

        ctx.save()
        ctx.setTransform(
            tm[0],
            tm[1],
            tm[2],
            tm[3],
            tm[4],
            tm[5]
        )
        ctx.setLineDash([10, 10])
        ctx.lineWidth = 2
        ctx.strokeStyle = 'yellow'
        ctx.beginPath()
        ctx.moveTo(this.start().x(), this.start().y())
        ctx.lineTo(this.center().x(), this.center().y())
        ctx.lineTo(this.end().x(), this.end().y())
        ctx.stroke()
        ctx.closePath()
        ctx.restore()

    }

}