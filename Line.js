'use strict'

class Line extends Element {
    constructor(...args) {
        super();
        this.path = null;
        this.lineWidth = 1;
        this.lineDash = [];
        this.lineCap = CanvasStyle.lineCap.Round
        this.lineJoin = CanvasStyle.lineJoin.Round
        this.strokeStyle = '#faba11'
        this.shadowColor = Colors.HTMLColor.red;
        this.globalCompositeOperation = CanvasStyle.globalCompositeOperation.source_over
        this.shadowBlur = 0;
        this.startPoint = new Point2D(0, 0)
        this.endPoint = new Point2D(0, 0)
        if (args.length) this.value(...args)
    }

    value(...args) {
        if (args.length == 1 && args[0] instanceof Line) {
            this.start(args[0].start())
            this.end(args[0].end())
        } else if (args.length == 2 && args[0] instanceof Point2D && args[1] instanceof Point2D) {
            this.start(args[0])
            this.end(args[1])
        } else {
            throw "Invalid arguments"
        }
        this.buildPath();
    }

    clone() {
        return new Line(this)
    }

    capStyle(e) {
        if (CanvasStyle.lineCap[e]) {
            this.lineCap = CanvasStyle.lineCap[e];
            this.buildHitTestPath()
        }
    }

    start(...args) {
        if (args.length) {
            this.startPoint.value(...args)
            this.buildPath();
        }
        return this.startPoint
    }

    end(...args) {
        if (args.length) {
            this.endPoint.value(...args)
            this.buildPath();
        }
        return this.endPoint
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

    color(...args) {
        if (args.length == 1) {
            if ((typeof args[0] == 'string' && args[0].match(/#{1}[a-fA-F0-9]{1,8}$/g)) || (args[0] instanceof CanvasGradient)) {
                this.color = args[0]
            } else {
                throw 'Invalid arguments'
            }
        }
        return this.color;
    }

    dash(...args) {
        if (args.length == 1) {
            if (args[0] instanceof Array) {
                this.lineDash = args[0]
            } else {
                throw 'Invalid arguments'
            }
        }
        return this.lineWidth;
    }

    //TODO: replace with addHitRegion???
    buildHitTestPath() {
        let r = this.lineWidth / 2;
        let dy = this.endPoint.y() - this.startPoint.y()
        let dx = this.endPoint.x() - this.startPoint.x()

        let alfa = Math.atan2(dy, dx);
        let diff
        this.hitPath = new Path2D();

        switch (this.lineCap) {
            case CanvasStyle.lineCap.Round:
                diff = new Point2D(r * Math.cos(alfa), r * Math.sin(alfa))
                this.hitPath.arc(this.startPoint.x(), this.startPoint.y(), r, alfa + Math.PI / 2, alfa + Math.PI * 3 / 2);
                this.hitPath.lineTo(this.endPoint.x() + diff.y(), this.endPoint.y() - diff.x())
                this.hitPath.arc(this.endPoint.x(), this.endPoint.y(), r, alfa + Math.PI * 3 / 2, alfa + Math.PI / 2)
                break;
            case CanvasStyle.lineCap.Butt:
                diff = new Point2D(r * Math.cos(alfa), r * Math.sin(alfa))
                this.hitPath.moveTo(this.startPoint.x() - diff.y(), this.startPoint.y() + diff.x())
                this.hitPath.lineTo(this.startPoint.x() + diff.y(), this.startPoint.y() - diff.x());
                this.hitPath.lineTo(this.endPoint.x() + diff.y(), this.endPoint.y() - diff.x());
                this.hitPath.lineTo(this.endPoint.x() - diff.y(), this.endPoint.y() + diff.x());
                break;
            case CanvasStyle.lineCap.Square:
                alfa += Math.PI / 4
                diff = new Point2D(r * Math.SQRT2 * Math.cos(alfa), r * Math.SQRT2 * Math.sin(alfa))
                this.hitPath.moveTo(this.startPoint.x() - diff.y(), this.startPoint.y() + diff.x())
                this.hitPath.lineTo(this.startPoint.x() - diff.x(), this.startPoint.y() - diff.y());
                this.hitPath.lineTo(this.endPoint.x() + diff.y(), this.endPoint.y() - diff.x());
                this.hitPath.lineTo(this.endPoint.x() + diff.x(), this.endPoint.y() + diff.y());
                break;
        }
        this.hitPath.closePath();
    }

    buildPath() {

        this.path = new Path2D();

        this.path.moveTo(this.startPoint.x(), this.startPoint.y());
        this.path.lineTo(this.endPoint.x(), this.endPoint.y())
        this.buildHitTestPath()
    }

    hitTest(x, y, tr, contextes) {

        let t = TransformationMatrix.multiply(tr, this.getTransformation()).inv().multiplyPoint(x, y)
        contextes.data.save();
        contextes.data.setTransform(1, 0, 0, 1, 0, 0);

        let ret = contextes.data.isPointInPath(this.hitPath, t[0], t[1])
        contextes.data.restore();
        return ret;
    }

    draw(contextes, parentT) {
        if (this.enableDraw) {

            contextes.data.save();

            let t = TransformationMatrix.multiply(parentT, this.transformation)
            let ts = t.valueOf()
            contextes.data.setTransform(
                ts[0],
                ts[1],
                ts[2],
                ts[3],
                ts[4],
                ts[5]
            )

            contextes.data.globalCompositeOperation = this.globalCompositeOperation
            contextes.data.strokeStyle = this.strokeStyle
            contextes.data.lineWidth = this.lineWidth
            contextes.data.lineCap = this.lineCap
            contextes.data.lineJoin = this.lineJoin
            contextes.data.setLineDash(this.lineDash)
            contextes.data.shadowBlur = this.shadowBlur
            contextes.data.shadowColor = this.shadowColor
            contextes.data.stroke(this.path)

            //DEBUG: draw hitTestPath
            /*
            context.strokeStyle = 'black'
            context.lineWidth = 1
            context.stroke(this.hitPath)
            */

            contextes.data.restore();
            super.draw(contextes, null, t)
        }
    }

}