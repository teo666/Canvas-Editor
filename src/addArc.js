const __addArc = {
    0: {
        next: [1]
    },
    1: {
        event: 'mousedown',
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
            elem.center(p[0], p[1])
            elem.start(p[0], p[1])
            elem.end(p[0], p[1])
        },
        next: [2, 3],
        saveEvent: false
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
            editor.cursor.snapToCoordinatesSystem(mmv, editor.world.getTransformation())
            let p = elem.getParentsTransformations().inv().multiplyPoint(mmv.snap_x, mmv.snap_y)
            elem.start(p[0], p[1])
            if (elem.center().equal(elem.start())) {
                return true
            }
        },
        next: [4, 5, 6],
        saveEvent: false
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
            elem.start(p[0], p[1])
            elem.end(p[0], p[1])
        },
        next: [2, 3, 6],
        saveEvent: false
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
            elem.selected = false
            editor.cursor.snapToCoordinatesSystem(mmv, editor.world.getTransformation())
            let p = elem.getParentsTransformations().inv().multiplyPoint(mmv.snap_x, mmv.snap_y)
            elem.end(p[0], p[1])
            let c = Point2D.add(elem.end(), elem.start())
            console.log(c)
            elem.pivot.value(c.x()/2,c.y()/2)
        },
        next: [],
        saveEvent: false
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
            elem.end(p[0], p[1])

        },
        next: [4, 5, 6, 7],
        saveEvent: false
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
        next: [4, 5, 6, 7],
        saveEvent: false
    }

}