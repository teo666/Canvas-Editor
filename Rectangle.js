'use strict'

class Rectangle extends Element {
    constructor(...args) {
        super();
        this.path = null;
        this.lineWidth = 10;
        this.lineDash = [];
        this.strokeStyle = Colors.HTMLColor.yellow
        this.fillStyle = Colors.HTMLColor.green
        this.lineCap = CanvasStyle.lineCap.Round
        this.lineJoin = CanvasStyle.lineJoin.Round
        this.shadowColor = Colors.HTMLColor.red;
        this.globalCompositeOperation = CanvasStyle.globalCompositeOperation.source_over
        this.shadowBlur = 0;

        this.startPoint = new Point2D(0, 0)
        let a = new Handle(this.startPoint)
        a.parent(this)
        this.controls.add(a)

        this.endPoint = new Point2D(0, 0)
        a = new Handle(this.endPoint)
        a.parent(this)
        this.controls.add(a)

        if (args.length) this.value(...args)
    }

    value(...args) {
        if (args.length == 1 && args[0] instanceof Rectangle) {
            this.cornerPoint.value(args[0].cornerPoint)
            this.sizes.value(args[0].sizes)
        } else if (args.length == 4 &&
            typeof args[0] == 'number' &&
            typeof args[1] == 'number' &&
            typeof args[2] == 'number' &&
            typeof args[3] == 'number') {
            this.cornerPoint.value(args[0], args[1])
            this.sizes.value(args[2], args[2])
        } else if (args.length == 2 &&
            args[0] instanceof Point2D &&
            args[1] instanceof Size2D) {
            this.cornerPoint.value(args[0])
            this.sizes.value(args[1])
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

    size(...args) {
        if (args.length == 2 && typeof args[0] == 'number' && typeof args[1] == 'number' ) {
            this.end(this.startPoint.x() + args[0], this.startPoint.y() + args[1])
        }
        return Point2D.subtract(this.endPoint, this.startPoint)
    }

    dimensions(){
        this.size().abs()
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

    buildPath() {
        this.path = new Path2D()
        this.path.rect(this.startPoint.x(), this.startPoint.y(), this.size().w(), this.size().h())
        this.buildHitTestPath()
    }

    buildHitTestPath() {
        const r = this.width() / 2
        const ws = Math.sign(this.size().w()) * r
        const hs = Math.sign(this.size().h()) * r

        this.hitPath = new Path2D()

        switch (this.lineJoin) {
            case CanvasStyle.lineJoin.Round:
                this.hitPath.moveTo(this.startPoint.x(), this.startPoint.y() - hs)
                this.hitPath.lineTo(this.startPoint.x() + this.size().w(), this.startPoint.y() - hs)
                this.hitPath.arcTo(this.startPoint.x() + this.size().w() + ws, this.startPoint.y() - hs, this.startPoint.x() + this.size().w() + ws, this.startPoint.y(), r)
                this.hitPath.lineTo(this.startPoint.x() + this.size().w() + ws, this.startPoint.y() + this.size().h())
                this.hitPath.arcTo(this.startPoint.x() + this.size().w() + ws, this.startPoint.y() + this.size().h() + hs, this.startPoint.x() + this.size().w(), this.startPoint.y() + this.size().h() + hs, r)
                this.hitPath.lineTo(this.startPoint.x(), this.startPoint.y() + this.size().h() + hs)
                this.hitPath.arcTo(this.startPoint.x() - ws, this.startPoint.y() + this.size().h() + hs, this.startPoint.x() - ws, this.startPoint.y() + this.size().h(), r)
                this.hitPath.lineTo(this.startPoint.x() - ws, this.startPoint.y())
                this.hitPath.arcTo(this.startPoint.x() - ws, this.startPoint.y() - hs, this.startPoint.x(), this.startPoint.y() - hs, r)
                this.hitPath.closePath()
                break;
            case CanvasStyle.lineJoin.Miter:
                this.hitPath.rect(this.cornerPoint.x() - ws, this.cornerPoint.y() - hs, this.sizes.w() + 2 * ws, this.sizes.h() + 2 * hs)
                break;
            case CanvasStyle.lineJoin.Bavel:
                this.hitPath.moveTo(this.startPoint.x(), this.startPoint.y() - hs)
                this.hitPath.lineTo(this.startPoint.x() + this.size().w(), this.startPoint.y() - hs)
                this.hitPath.lineTo(this.startPoint.x() + this.size().w() + ws, this.startPoint.y())
                this.hitPath.lineTo(this.startPoint.x() + this.size().w() + ws, this.startPoint.y() + this.size().h())
                this.hitPath.lineTo(this.startPoint.x() + this.size().w(), this.startPoint.y() + this.size().h() + hs)
                this.hitPath.lineTo(this.startPoint.x(), this.startPoint.y() + this.size().h() + hs)
                this.hitPath.lineTo(this.startPoint.x() - ws, this.startPoint.y() + this.size().h())
                this.hitPath.lineTo(this.startPoint.x() - ws, this.startPoint.y())
                this.hitPath.lineTo(this.startPoint.x(), this.startPoint.y() - hs)
                this.hitPath.closePath()
                break;
        }
    }

    hitTest(x, y, tr, contextes) {

        //console.log('hittest', arguments)
        let t = TransformationMatrix.multiply(tr, this.getTransformation()).inv().multiplyPoint(x, y)
        contextes.data.save();
        contextes.data.setTransform(1, 0, 0, 1, 0, 0);

        let ret = contextes.data.isPointInPath(this.hitPath, t[0], t[1])
        contextes.data.restore();
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
            ctx.fillStyle = this.fillStyle
            ctx.fill(this.path)
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