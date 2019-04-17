'use strict'

class Arc extends Element {
    constructor(...args) {
        super()
        this.path = null;
        this.lineWidth = 7;
        this.lineDash = [];
        this.strokeStyle = Colors.HTMLColor.red
        this.fillStyle = Colors.HTMLColor.red
        this.globalCompositeOperation = this.globalCompositeOperation
        this.lineCap = CanvasStyle.lineCap.Round
        this.lineJoin = CanvasStyle.lineJoin.Round
        this.shadowBlur = this.shadowBlur
        this.shadowColor = this.shadowColor

        this.anticlockwise = false

        this.centerPoint = new Point2D(0, 0)
        
        let a = new Handle(this.centerPoint)
        a.parent(this)
        this.controls.add(a)

        this.startPoint = new Point2D(0,0)
        a = new Handle(this.startPoint)
        a.parent(this)
        this.controls.add(a)

        this.endPoint = new Point2D(0,0)
        a = new Handle(this.endPoint)
        a.parent(this)
        this.controls.add(a)

        this.angles = new Size2D(0, Math.PI / 2)
        this.anticlockwise = false
        if (args.length) this.buildPath()

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

    radius() {
        return Point2D.hypot(this.center(), this.start())
    }

    center(...args) {
        if (args.length > 0) {
            this.centerPoint.value(...args)
            this.buildPath()
        }
        return this.centerPoint
    }

    rotation(...args) {
        if (args.length > 0) {
            if(typeof args[0] == 'string'){
                if(args[0] == 'true'){
                    this.anticlockwise = true
                } else {
                    this.anticlockwise = false
                }
            } else {
                this.anticlockwise = args[0] && true
            }
            this.buildPath()
        }
        return this.anticlockwise
    }

    buildPath() {
        this.path = new Path2D();
        const startAngle = Point2D.angle(this.center(), this.start())
        let endAngle = Point2D.angle(this.center(), this.end())
        if(this.start().equal(this.end())){
            endAngle = startAngle + Math.PI*2
        }
        this.path.arc(this.centerPoint.x(), this.centerPoint.y(), this.radius(), startAngle, endAngle, this.anticlockwise);
    }

    start(...args){
        if(args.length){
            this.startPoint.value(...args)
            this.buildPath()
        }
        return this.startPoint
    }

    end(...args){
        if(args.length){
            this.endPoint.value(...args)
            this.buildPath()
        }
        return this.endPoint
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
            /*
            context.strokeStyle = 'black'
            context.lineWidth = 1
            context.stroke(this.hitPath)
            */

            ctx.restore();
            if(this.selected){
                this.onEdit(contextes)
            }
            super.draw(contextes, null, t)
        }
    }

    onEdit(contextes) {
        //TODO:
    }
}