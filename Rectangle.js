'use strict'

class Rectangle extends Element {
    constructor() {
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
        this.path.moveTo(this.cornerPoint.x(), this.cornerPoint.y())
        this.path.lineTo(this.cornerPoint.x() + this.sizes.w(), this.cornerPoint.y())
        this.path.lineTo(this.cornerPoint.x() + this.sizes.w(), this.cornerPoint.y() + this.sizes.h())
        this.path.lineTo(this.cornerPoint.x(), this.cornerPoint.y() + this.sizes.h())
        this.path.closePath()

        this.buildHitTestPath()
    }

    buildHitTestPath() {
        const r = this.width() / 2
        const ws = Math.sign(this.size().w()) * r
        const hs = Math.sign(this.size().h()) * r

        this.hitPath = new Path2D()
        this.hitPath.moveTo(this.corner().x(), this.corner().y() - hs)
        this.hitPath.lineTo(this.corner().x() + this.size().w(), this.corner().y() - hs)
        this.hitPath.arcTo(this.corner().x() + this.size().w() + ws, this.corner().y() - hs, this.corner().x() + this.size().w() + ws, this.corner().y(), r)
        this.hitPath.lineTo(this.corner().x() + this.size().w() + ws, this.corner().y() + this.size().h())
        this.hitPath.arcTo(this.corner().x() + this.size().w() + ws, this.corner().y() + this.size().h() + hs,this.corner().x() + this.size().w(),this.corner().y() + this.size().h() + hs,r)
        this.hitPath.lineTo(this.corner().x(),this.corner().y() + this.size().h() + hs)
        this.hitPath.arcTo(this.corner().x() - ws, this.corner().y() + this.size().h() + hs,this.corner().x() - ws,this.corner().y() + this.size().h(),r)
        this.hitPath.lineTo(this.corner().x() - ws,this.corner().y())
        this.hitPath.arcTo(this.corner().x() - ws,this.corner().y() - hs, this.corner().x(),this.corner().y() - hs,r)
        this.hitPath.closePath()
    }

    hitTest(x, y, tr, context, canvas) {

        //console.log('hittest', arguments)
        let t = TransformationMatrix.multiply(tr, this.getTransformation()).inv().multiplyPoint(x, y)
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);

        let ret = context.isPointInPath(this.hitPath, t[0], t[1])
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

            context.globalCompositeOperation = this.globalCompositeOperation
            context.strokeStyle = this.strokeStyle
            context.lineWidth = this.lineWidth
            context.lineCap = this.lineCap
            context.lineJoin = this.lineJoin
            context.setLineDash(this.lineDash)
            context.shadowBlur = this.shadowBlur
            context.shadowColor = this.shadowColor
            context.fillStyle = this.fillStyle
            context.fill(this.path)
            if (this.lineWidth) {
                context.stroke(this.path)
            }
            /*context.strokeStyle = 'red'
            context.lineWidth = 1
            context.stroke(this.hitPath)*/

            if (this.selected) {
                this.pivot.draw(context, t)
            }
            context.restore();
            super.draw(context, null, t)
        }
    }
}