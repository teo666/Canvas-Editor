const __addArc = {
    0: {
        next: [1]
    },
    1: {
        //setta il centro
        event: 'mousedown',
        callback: function (editor, elem, parent, events, e, mem) {
            mem['draw_construction'] = function (ctx, editor, elem, mem) {

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
                if (mem.endp) {
                    ctx.moveTo(elem.center().x(), elem.center().y())
                    ctx.lineTo(mem['endp'][0], mem['endp'][1])
                }
                ctx.stroke()
                ctx.closePath()
                ctx.restore()
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
            //elem.pending = false;
            let p = elem.getParentsTransformations().inv().multiplyPoint(mmv.snap_x, mmv.snap_y)
            elem.center(p[0], p[1]);
            elem.pivot.center(p[0], p[1]);
            elem.start(p[0],p[1])
            elem.end(p[0],p[1])
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
            elem.enable();
            elem.enablePivot();
            editor.cursor.snapToCoordinatesSystem(mmv, editor.world.getTransformation())
            let p = elem.getParentsTransformations().inv().multiplyPoint(mmv.snap_x, mmv.snap_y)
            elem.start(p[0], p[1])
            if (elem.center().equal(elem.start())) {
                return true
            }
        },
        postDraw: function (editor, elem, parent, events, e, mem) {
            mem['draw_construction'](editor.contextes.fg, editor, elem, mem)
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
            elem.enable();
            elem.start(p[0], p[1])
            elem.end(p[0],p[1])
            mem['startp'] = p
        },
        postDraw: function (editor, elem, parent, events, e, mem) {
            mem['draw_construction'](editor.contextes.fg, editor, elem, mem)
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
            elem.end(p[0],p[1])
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
            let p = elem.getParentsTransformations().inv().multiplyPoint(mmv.snap_x, mmv.snap_y)
            mem['endp'] = p
            elem.end(p[0],p[1])

        },
        postDraw: function (editor, elem, parent, events, e, mem) {
            mem['draw_construction'](editor.contextes.fg, editor, elem, mem)
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
        },
        postDraw: function (editor, elem, parent, events, e, mem) {
            mem['draw_construction'](editor.contextes.fg, editor, elem, mem)
        },
        next: [4, 5, 6, 7],
        saveEvent: false
    },
    7: {
        event: 'mousedown',
        callback: function (editor, elem, parent, events, e, mem) {
            if (EventUtil.Button.MIDDLE == e.button) {
                elem.rotation(!elem.rotation())
                return true
            }
        },
        postDraw: function (editor, elem, parent, events, e, mem) {
            mem['draw_construction'](editor.contextes.fg, editor, elem, mem)
        },
        next: [4, 5, 6, 7],
        saveEvent: false
    }

}