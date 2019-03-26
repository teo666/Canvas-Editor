const __addArcUtil = {
    drawConstructionLine: function (ctx, editor, elem, mem) {
        editor.clearForeground()

        const tm = editor.world.getTransformation().valueOf()
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
        ctx.moveTo(elem.center().x(), elem.center().y())
        ctx.lineTo(mem['startp'][0], mem['startp'][1])
        if(mem.endp){
            ctx.moveTo(elem.center().x(), elem.center().y())
            ctx.lineTo(mem['endp'][0], mem['endp'][1])
        }
        ctx.stroke()
        ctx.closePath()
        ctx.restore()
    }
}

const __addArc = {
    0: {
        next: [1]
    },
    1: {
        //setta il centro
        event: 'mousedown',
        callback: function (editor, elem, parent, events, e, mem) {
            let rect = e.target.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;
            e.preventDefault();
            let mmv = {
                x: x,
                y: y
            }
            editor.cursor.snapToCoordinatesSystem(mmv, editor.world.getTransformation())
            //elem.pending = false;
            let p = elem.getParentsTransformations().inv().multiplyPoint(mmv.snap_x, mmv.snap_y)
            elem.center(p[0], p[1]);
            elem.pivot.center(p[0], p[1]);
            elem.startAngle(0)
            elem.endAngle(Math.PI * 2)
            editor.draw();
        },
        next: [2, 3],
        saveEvent: true
    },

    2: {
        //setta l'angolo1
        event: 'mouseup',
        callback: function (editor, elem, parent, events, e, mem) {
            if (EventUtil.Button.LEFT != e.button) {
                return true
            }
            let rect = e.target.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;
            e.preventDefault();
            let mmv = {
                x: x,
                y: y
            }
            elem.pending = false;
            editor.cursor.snapToCoordinatesSystem(mmv, editor.world.getTransformation())
            let p = elem.getParentsTransformations().inv().multiplyPoint(mmv.snap_x, mmv.snap_y)
            let start = new Point2D(p[0], p[1])
            if (elem.center().equal(start)) {
                return true
            }
            let angle1 = Point2D.angle(elem.center(), start)
            mem['angle1'] = angle1
            elem.startAngle(angle1)
            //elem.endAngle(angle1 + Math.PI)
            elem.radius(Point2D.hypot(elem.center(), start))
            editor.draw()
            editor.contextes.data.save()
            editor.contextes.data.setLineDash([10, 10])
            editor.contextes.data.lineWidth = 2
            editor.contextes.data.strokeStyle = 'yellow'
            editor.contextes.data.beginPath()
            editor.contextes.data.moveTo(elem.center().x(), elem.center().y())
            editor.contextes.data.lineTo(p[0], p[1])
            editor.contextes.data.stroke()
            editor.contextes.data.closePath()
            editor.contextes.data.restore()
        },
        next: [4, 5, 6],
        saveEvent: true
    },
    3: {
        event: 'mousemove',
        callback: function (editor, elem, parent, events, e, mem) {
            let rect = e.target.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;
            e.preventDefault();
            let mmv = {
                x: x,
                y: y
            }
            editor.cursor.snapToCoordinatesSystem(mmv, editor.world.getTransformation())
            let p = elem.getParentsTransformations().inv().multiplyPoint(mmv.snap_x, mmv.snap_y)
            mem['startp'] = p
            elem.pending = true;
            let start = new Point2D(p[0], p[1])
            let angle1 = Point2D.angle(elem.center(), start)
            elem.startAngle(angle1)
            elem.endAngle(angle1 + Math.PI * 2)
            elem.radius(Point2D.hypot(elem.center(), start))
            editor.draw()
            __addArcUtil.drawConstructionLine(editor.contextes.fg,editor,elem,mem)
        },
        next: [2, 3, 6],
        saveEvent: true
    },
    4: {
        //setta l'angolo2
        event: 'mouseup',
        callback: function (editor, elem, parent, events, e, mem) {
            if (EventUtil.Button.LEFT != e.button) {
                return true
            }
            let rect = e.target.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;
            e.preventDefault();
            let mmv = {
                x: x,
                y: y
            }
            editor.cursor.snapToCoordinatesSystem(mmv, editor.world.getTransformation())
            let p = elem.getParentsTransformations().inv().multiplyPoint(mmv.snap_x, mmv.snap_y)
            let angle2 = Point2D.angle(elem.center(), new Point2D(p[0], p[1]))
            if (angle2 == mem.angle1) {
                angle2 = mem.angle1 + Math.PI * 2
            }
            elem.endAngle(angle2)
            editor.drawForeground()
            editor.draw();
        },
        next: [],
        saveEvent: true
    },
    5: {
        //setta l'angolo2
        event: 'mousemove',
        callback: function (editor, elem, parent, events, e, mem) {
            let rect = e.target.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;
            e.preventDefault();
            let mmv = {
                x: x,
                y: y
            }
            editor.cursor.snapToCoordinatesSystem(mmv, editor.world.getTransformation())
            //elem.pending = false;
            let p = elem.getParentsTransformations().inv().multiplyPoint(mmv.snap_x, mmv.snap_y)
            let angle2 = Point2D.angle(elem.center(), new Point2D(p[0], p[1]))
            if (angle2 == mem.angle1) {
                angle2 = mem.angle1 + Math.PI * 2
            }
            elem.endAngle(angle2)
            mem['endp'] = p
            editor.draw();
            __addArcUtil.drawConstructionLine(editor.contextes.fg,editor,elem,mem)

        },
        next: [4, 5, 6, 7],
        saveEvent: true
    },

    6: {
        event: 'mousewheel',
        callback: function (editor, elem, parent, events, e, mem) {
            e.preventDefault()
            let inc
            if (e.deltaY > 0) {
                inc = -1
            } else {
                inc = 1
            }
            elem.width(Math.max(1, elem.width() + inc));
            editor.draw();

            __addArcUtil.drawConstructionLine(editor.contextes.fg,editor,elem,mem)

        },
        next: [4, 5, 6, 7],
        saveEvent: false
    },
    7: {
        event: 'mousedown',
        callback: function (editor, elem, parent, events, e, mem) {
            if (EventUtil.Button.MIDDLE == e.button) {
                elem.rotation(!elem.rotation())
                editor.draw()
                __addArcUtil.drawConstructionLine(editor.contextes.fg,editor,elem,mem)

                return true
            }
        },
        next: [4, 5, 6, 7],
        saveEvent: false
    }

}