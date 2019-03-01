'use strict'

class Line extends Element {
    constructor(...args) {
        super();
        this.path = null;
        this.lineWidth = 1;
        this.lineDash = [];
        this.lineCap = CanvasStyle.lineCap.Round
        this.lineJoin = CanvasStyle.lineJoin.Round
        this.strokeStyle = '#faba11aa'
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

    buildPath() {

        this.path = new Path2D();

        this.path.moveTo(this.startPoint.x(), this.startPoint.y());
        this.path.lineTo(this.endPoint.x(), this.endPoint.y())
        //this.buildHitTestPath()
    }

    buildHitTestPath() {
        let r = this.lineWidth / 2;
        let dy = this.endPoint.y() - this.startPoint.y()
        let dx = this.endPoint.x() - this.startPoint.x()

        let alfa = -Math.atan(dx / dy);
        if (dy < 0) {
            alfa += Math.pi
        }

        let diff = new Point2D(r * Math.cos(alfa), r * Math.sin(alfa))
        this.hitPath = new Path2D();

        this.hitPath.moveTo(this.startPoint.x() - diff.x(), this.startPoint.y() - diff.y());
        this.hitPath.lineTo(this.startPoint.x() + diff.x(), this.startPoint.y() + diff.y());
        this.hitPath.lineTo(this.endPoint.x() + diff.x(), this.endPoint.y() + diff.y());
        this.hitPath.lineTo(this.endPoint.x() - diff.x(), this.endPoint.y() - diff.y());
        this.hitPath.closePath()
    }

    hitTest(x, y, tr, context) {
        //console.log('hittest', arguments)
        let t = tr.clone().multiply(this.getTransformation()).inv().multiplyPoint(x, y)
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);

        let ret = context.isPointInPath(this.hitPath, t[0], t[1])
        context.restore();
        return ret;
    }

    draw(context, parentT) {
        if (this.enableDraw) {

            context.save();

            let ts = TransformationMatrix.multiply(parentT, this.transformation).valueOf()

            context.setTransform(
                ts[0],
                ts[1],
                ts[2],
                ts[3],
                ts[4],
                ts[5]
            )

            context.strokeStyle = 'black'
            context.strokeStyle = this.strokeStyle;
            context.lineWidth = this.lineWidth
            context.lineCap = this.lineCap
            context.lineJoin = this.lineJoin
            context.setLineDash(this.lineDash)
            context.stroke(this.path)
            context.restore();
        }
    }

}