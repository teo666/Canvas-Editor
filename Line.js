'use strict'

class Line extends Element {
    constructor(...args) {
        super();
        this.path = null;
        this.lineWidth = 1;
        this.lineDash = [];
        this.strokeStyle = '#faba11aa'
        this.value(...args)
    }

    value(...args) {
        if (args.length == 1 && args[0] instanceof Line) {
            this.start = args[0].getStart;
            this.end = args[0].getEnd;
        } else if (args.length == 2 && args[0] instanceof Point2D && args[1] instanceof Point2D) {
            this.start = new Point2D(args[0]);
            this.end = new Point2D(args[1])
        } else {
            this.start = new Point2D(0, 0);
            this.end = new Point2D(100, 100)
        }
        this.buildPath();
    }

    clone() {
        return new Line(this)
    }

    get getStart() {
        return math.clone(this.start)
    }

    get getEnd() {
        return math.clone(this.end)
    }

    setStart(...args) {
        this.start.value(...args)
        this.buildPath();
    }

    setEnd(...args) {
        this.end.value(...args)
        this.buildPath();
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
            if ((typeof args[0] == 'string' && args[0].match( /#{1}[a-fA-F0-9]{1,8}$/g)) || ( args[0] instanceof CanvasGradient)) {
                this.color = args[0]
            } else {
                throw 'Invalid arguments'
            }
        }
        return this.color;
    }

    dash(...args) {
        if (args.length == 1) {
            if ( args[0] instanceof Array) {
                this.lineDash = args[0]
            } else {
                throw 'Invalid arguments'
            }
        }
        return this.lineWidth;
    }

    buildPath() {

        this.path = new Path2D();

        this.path.moveTo(this.start.x(), this.start.y());
        this.path.lineTo(this.end.x(), this.end.y())
        //this.buildHitTestPath()
    }

    buildHitTestPath() {
        let r = this.lineWidth / 2;
        let dy = this.end.y() - this.start.y()
        let dx = this.end.x() - this.start.x()

        let alfa = -math.atan(dx / dy);
        if (dy < 0) {
            alfa += math.pi
        }

        let diff = new Point2D(r * math.cos(alfa), r * math.sin(alfa))
        this.hitPath = new Path2D();

        this.hitPath.moveTo(this.start.x() - diff.x(), this.start.y() - diff.y());
        this.hitPath.lineTo(this.start.x() + diff.x(), this.start.y() + diff.y());
        this.hitPath.lineTo(this.end.x() + diff.x(), this.end.y() + diff.y());
        this.hitPath.lineTo(this.end.x() - diff.x(), this.end.y() - diff.y());
        this.hitPath.closePath()
    }

    hitTest(x, y, tr, context) {
        //console.log('hittest', arguments)
        let t = math.multiply(math.inv(math.multiply(tr, this.getTransformation)), [x, y, 1]).valueOf();
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);

        let ret = context.isPointInPath(this.hitPath, t[0], t[1])
        context.restore();
        return ret;
    }

    draw(context, parentT) {
        context.save();

        let ts = math.multiply(parentT, this.transformation);

        context.setTransform(
            math.subset(ts, math.index(0, 0)),
            math.subset(ts, math.index(1, 0)),
            math.subset(ts, math.index(0, 1)),
            math.subset(ts, math.index(1, 1)),
            math.subset(ts, math.index(0, 2)),
            math.subset(ts, math.index(1, 2))
        )
        context.strokeStyle = 'black'
        context.strokeStyle = this.strokeStyle;
        context.lineWidth = this.lineWidth
        context.setLineDash(this.lineDash)
        context.stroke(this.path)
        context.restore();
    }

}