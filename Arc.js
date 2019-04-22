'use strict'

class Arc extends Element {
    constructor(...args) {
        super()
        this.path = null;
        this.lineWidth = 20;
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
        a.shape = Handle.shape.cross
        a.strokeStyle = Colors.HTMLColor.white
        a.postChange = function () {
            this.constraints()
        }.bind(this)
        a.parent(this)
        this.controls.add(a)

        this.endPoint = new Point2D(0, 0)
        a = new Handle(this.endPoint)
        a.postChange = function () {
            const endAnglePoint = Point2D.subtract(this.endPoint, this.centerPoint)
            let endAngle = Point2D.angle(new Point2D(0, 0), endAnglePoint)
            this.angleSize.y(endAngle)
            this.constraints()
        }.bind(this)
        a.snapEnabled = false
        a.parent(this)
        this.controls.add(a)

        this.startPoint = new Point2D(0, 0)
        a = new Handle(this.startPoint)
        a.postChange = function () {
            const startAnglePoint = Point2D.subtract(this.startPoint, this.centerPoint)
            const startAngle = Point2D.angle(new Point2D(0, 0), startAnglePoint)
            this.angleSize.x(startAngle)
            this.constraints()
        }.bind(this)
        a.snapEnabled = false
        a.parent(this)
        this.controls.add(a)

        this.angleSize = new Size2D(0, Math.PI * 2)

        this.radiusLength = 100

        this.radiusHandlePoint = new Point2D(0, 0)
        a = new Handle(this.radiusHandlePoint)
        a.shape = Handle.shape.square
        a.postChange = function () {
            this.radius(Point2D.subtract(this.centerPoint, this.radiusHandlePoint).y())
            this.constraints()
        }.bind(this)
        a.parent(this)
        this.controls.add(a)

        this.buildPath()
    }

    constraints() {
        this.start().x(this.radiusLength * Math.cos(this.angleSize.x()) + this.centerPoint.x())
        this.start().y(this.radiusLength * Math.sin(this.angleSize.x()) + this.centerPoint.y())

        this.end().x(this.radiusLength * Math.cos(this.angleSize.y()) + this.centerPoint.x())
        this.end().y(this.radiusLength * Math.sin(this.angleSize.y()) + this.centerPoint.y())

        this.radiusHandlePoint.x(this.centerPoint.x())
        this.radiusHandlePoint.y(this.centerPoint.y() - this.radiusLength)
    }

    width(...args) {
        if (args.length == 1 && typeof args[0] == 'number') {
            this.lineWidth = args[0]
            this.buildPath()
        }
        return this.lineWidth;
    }

    radius(...args) {
        if (args.length == 1 && typeof args[0] == 'number') {
            this.radiusLength = args[0]
            this.constraints()
            this.buildPath()
        }
        return this.radiusLength
    }

    center(...args) {
        if (args.length > 0) {
            this.centerPoint.value(...args)
            this.constraints()
            this.buildPath()
        }
        return this.centerPoint
    }

    rotation(...args) {
        if (args.length > 0) {
            if (typeof args[0] == 'string') {
                if (args[0] == 'true') {
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
        if (this.angleSize.x() == this.angleSize.y()) {
            this.angleSize.y(Math.PI * 2)
        }
        this.path.arc(this.centerPoint.x(), this.centerPoint.y(), this.radius(), this.angleSize.x(), this.angleSize.y(), this.anticlockwise);
        this.buildHitTestPath()
    }

    buildHitTestPath() {
        //TODO: da fare completamente
        const w = this.lineWidth / 2
        let angle_3
        let angleX = this.angleSize.x()
        let angleY = this.angleSize.y()
        if (this.anticlockwise) {
            angleX = this.angleSize.y()
            angleY = this.angleSize.x()
        }
        if (angleX < angleY) {
            angle_3 = (angleY - angleX) / 3
        } else {
            angle_3 = (angleY + Math.PI * 2 - angleX) / 3
        }

        const angle_3_2 = angle_3 / 2
        const radius = this.radius() - w
        const RADIUS = this.radius() + w
        const hyp = radius * Math.tan(angle_3_2)
        const HYP = Math.abs(RADIUS * Math.tan(angle_3_2))

        const cp1 = Point2D.polarToCartesin(angleX, this.radius()).add(this.centerPoint)
        const cp2 = Point2D.polarToCartesin(angle_3 * 3 + angleX, this.radius()).add(this.centerPoint)

        const p1 = Point2D.polarToCartesin(angleX, radius).add(this.centerPoint)
        const p2 = Point2D.polarToCartesin(Math.PI / 2 + angleX, hyp).add(p1)
        const p3 = Point2D.polarToCartesin(angle_3 + angleX, radius).add(this.centerPoint)

        const p4 = Point2D.polarToCartesin(Math.PI / 2 + angle_3 + angleX, hyp).add(p3)
        const p5 = Point2D.polarToCartesin(angle_3 * 2 + angleX, radius).add(this.centerPoint)

        const p6 = Point2D.polarToCartesin(Math.PI / 2 + angle_3 * 2 + angleX, hyp).add(p5)
        const p7 = Point2D.polarToCartesin(angle_3 * 3 + angleX, radius).add(this.centerPoint)
        /******************* */
        const p8 = Point2D.polarToCartesin(angle_3 * 3 + angleX, RADIUS).add(this.centerPoint)

        const p9 = Point2D.polarToCartesin(-Math.PI / 2 + angle_3 * 3 + angleX, HYP).add(p8)
        const p10 = Point2D.polarToCartesin(angle_3 * 2 + angleX, RADIUS).add(this.centerPoint)
        const p11 = Point2D.polarToCartesin(-Math.PI / 2 + angle_3 * 2 + angleX, HYP).add(p10)
        const p12 = Point2D.polarToCartesin(angle_3 + angleX, RADIUS).add(this.centerPoint)
        const p13 = Point2D.polarToCartesin(-Math.PI / 2 + angle_3 + angleX, HYP).add(p12)
        const p14 = Point2D.polarToCartesin(angleX, RADIUS).add(this.centerPoint)

        this.hitPath = new Path2D();
        this.hitPath.moveTo(p1.x(), p1.y())
        this.hitPath.arcTo(p2.x(), p2.y(), p3.x(), p3.y(), radius)
        this.hitPath.arcTo(p4.x(), p4.y(), p5.x(), p5.y(), radius)
        this.hitPath.arcTo(p6.x(), p6.y(), p7.x(), p7.y(), radius)
        let p15, p16, p17
        switch (this.lineCap) {
            case CanvasStyle.lineCap.Round:
                p15 = Point2D.polarToCartesin(angle_3 * 3 + angleX + Math.PI / 2, w).add(p7)
                p16 = Point2D.polarToCartesin(angle_3 * 3 + angleX + Math.PI / 2, w).add(cp2)
                p17 = Point2D.polarToCartesin(angle_3 * 3 + angleX + Math.PI / 2, w).add(p8)
                this.hitPath.arcTo(p15.x(), p15.y(), p16.x(), p16.y(), w)
                this.hitPath.arcTo(p17.x(), p17.y(), p8.x(), p8.y(), w)
                break;
            case CanvasStyle.lineCap.Butt:
                this.hitPath.lineTo(p8.x(), p8.y())
                break;
            case CanvasStyle.lineCap.Square:
                p15 = Point2D.polarToCartesin(angle_3 * 3 + angleX + Math.PI / 2, w).add(p7)
                p17 = Point2D.polarToCartesin(angle_3 * 3 + angleX + Math.PI / 2, w).add(p8)
                this.hitPath.lineTo(p15.x(), p15.y())
                this.hitPath.lineTo(p17.x(), p17.y())
                this.hitPath.lineTo(p8.x(), p8.y())
                break;
        }
        this.hitPath.arcTo(p9.x(), p9.y(), p10.x(), p10.y(), RADIUS)
        this.hitPath.arcTo(p11.x(), p11.y(), p12.x(), p12.y(), RADIUS)
        this.hitPath.arcTo(p13.x(), p13.y(), p14.x(), p14.y(), RADIUS)
        let p18, p19, p20
        switch (this.lineCap) {
            case CanvasStyle.lineCap.Round:
                p18 = Point2D.polarToCartesin(angleX - Math.PI / 2, w).add(p14)
                p19 = Point2D.polarToCartesin(angleX - Math.PI / 2, w).add(cp1)
                p20 = Point2D.polarToCartesin(angleX - Math.PI / 2, w).add(p1)
                this.hitPath.arcTo(p18.x(), p18.y(), p19.x(), p19.y(), w)
                this.hitPath.arcTo(p20.x(), p20.y(), p1.x(), p1.y(), w)
                break;
            case CanvasStyle.lineCap.Butt:
                break;
            case CanvasStyle.lineCap.Square:
                p18 = Point2D.polarToCartesin(angleX - Math.PI / 2, w).add(p14)
                p20 = Point2D.polarToCartesin(angleX - Math.PI / 2, w).add(p1)
                this.hitPath.lineTo(p18.x(), p18.y())
                this.hitPath.lineTo(p20.x(), p20.y())
                break;
        }
        this.hitPath.closePath()

    }

    start(...args) {
        if (args.length) {
            this.startPoint.value(...args)
            this.constraints()
            this.buildPath()
        }
        return this.startPoint
    }

    end(...args) {
        if (args.length) {
            this.endPoint.value(...args)
            this.constraints()
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

            /*contextes.fg.strokeStyle = 'yellow'
            contextes.fg.lineWidth = 1
            contextes.fg.stroke(this.hitPath)*/


            //if (this.select) this.edit(contextes)
            ctx.restore();
            super.draw(contextes, null, t)
        }
    }

    onEdit(contextes) {
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