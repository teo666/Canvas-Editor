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

        this.cornerPoint = new Point2D(0, 0)
        this.sizes = new Size2D(0, 0)
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
        if (args.length) {
            this.sizes.value(...args)
            this.buildPath()
        }
        return this.sizes
    }

    corner(...args) {
        if (args.length) {
            this.cornerPoint.value(...args)
            this.buildPath()
        }
        return this.cornerPoint
    }

    buildPath() {
        this.path = new Path2D()
        this.path.rect(this.cornerPoint.x(), this.cornerPoint.y(), this.sizes.w(), this.sizes.h())
        this.buildHitTestPath()
    }

    buildHitTestPath() {
        const r = this.width() / 2
        const ws = Math.sign(this.size().w()) * r
        const hs = Math.sign(this.size().h()) * r

        this.hitPath = new Path2D()

        switch (this.lineJoin) {
            case CanvasStyle.lineJoin.Round:
                this.hitPath.moveTo(this.corner().x(), this.corner().y() - hs)
                this.hitPath.lineTo(this.corner().x() + this.size().w(), this.corner().y() - hs)
                this.hitPath.arcTo(this.corner().x() + this.size().w() + ws, this.corner().y() - hs, this.corner().x() + this.size().w() + ws, this.corner().y(), r)
                this.hitPath.lineTo(this.corner().x() + this.size().w() + ws, this.corner().y() + this.size().h())
                this.hitPath.arcTo(this.corner().x() + this.size().w() + ws, this.corner().y() + this.size().h() + hs, this.corner().x() + this.size().w(), this.corner().y() + this.size().h() + hs, r)
                this.hitPath.lineTo(this.corner().x(), this.corner().y() + this.size().h() + hs)
                this.hitPath.arcTo(this.corner().x() - ws, this.corner().y() + this.size().h() + hs, this.corner().x() - ws, this.corner().y() + this.size().h(), r)
                this.hitPath.lineTo(this.corner().x() - ws, this.corner().y())
                this.hitPath.arcTo(this.corner().x() - ws, this.corner().y() - hs, this.corner().x(), this.corner().y() - hs, r)
                this.hitPath.closePath()
                break;
            case CanvasStyle.lineJoin.Miter:
                this.hitPath.rect(this.cornerPoint.x() - ws, this.cornerPoint.y() - hs, this.sizes.w() + 2 * ws, this.sizes.h() + 2 * hs)
                break;
            case CanvasStyle.lineJoin.Bavel:
                this.hitPath.moveTo(this.corner().x(), this.corner().y() - hs)
                this.hitPath.lineTo(this.corner().x() + this.size().w(), this.corner().y() - hs)
                this.hitPath.lineTo(this.corner().x() + this.size().w() + ws, this.corner().y())
                this.hitPath.lineTo(this.corner().x() + this.size().w() + ws, this.corner().y() + this.size().h())
                this.hitPath.lineTo(this.corner().x() + this.size().w(), this.corner().y() + this.size().h() + hs)
                this.hitPath.lineTo(this.corner().x(), this.corner().y() + this.size().h() + hs)
                this.hitPath.lineTo(this.corner().x() - ws, this.corner().y() + this.size().h())
                this.hitPath.lineTo(this.corner().x() - ws, this.corner().y())
                this.hitPath.lineTo(this.corner().x(), this.corner().y() - hs)
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