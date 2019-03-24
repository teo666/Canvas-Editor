const __addEllipse = {
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
            elem.pending = false;
            let p = elem.getParentsTransformations().inv().multiplyPoint(mmv.snap_x, mmv.snap_y)
            elem.center(p[0], p[1]);
            elem.pivot.center(elem.center())
        },
        next: [2, 3],
        saveEvent: false
    },

    2: {
        //setta l'angolo1
        event: 'mouseup',
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
            let radius = Point2D.subtract(elem.center(), new Point2D(p[0], p[1])).abs().toSize2D()

            elem.radius(radius)
            if (!(radius.x() || radius.y())) {
                return true
            }
            elem.buildPath()
            editor.draw()
        },
        next: [],
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
            //console.log(elem.center().x(),elem.center().y(), p[0],p[1])
            let radius = Point2D.subtract(elem.center(), new Point2D(p[0], p[1])).abs().toSize2D()
            elem.radius(radius)
            elem.buildPath()
            editor.draw()
        },
        next: [2, 3],
        saveEvent: false
    }

}

const __addEllipseBoundingCorner = {
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
            elem.pending = false;
            let p = elem.getParentsTransformations().inv().multiplyPoint(mmv.snap_x, mmv.snap_y)
            mem['corner'] = new Point2D(p[0], p[1])
            elem.center(mem.corner);
            elem.pivot.center(elem.center())
        },
        next: [2, 3, 4],
        saveEvent: false
    },

    2: {
        //setta l'angolo1
        event: 'mouseup',
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
            let radius2 = Point2D.subtract(mem.corner, new Point2D(p[0], p[1])).abs().toSize2D()
            radius2.w(radius2.w() / 2)
            radius2.h(radius2.h() / 2)
            elem.center(mem.corner.x() + radius2.w(), mem.corner.y() + radius2.h())
            elem.radius(radius2)
            elem.pivot.center(elem.center())


            if (!(radius2.x() || radius2.y())) {
                return true
            }
            //elem.buildPath()
            editor.draw()
        },
        next: [],
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
            //console.log(elem.center().x(),elem.center().y(), p[0],p[1])
            let radius2 = Point2D.subtract(mem.corner, new Point2D(p[0], p[1])).abs().toSize2D()
            radius2.w(radius2.w() / 2)
            radius2.h(radius2.h() / 2)
            elem.center(mem.corner.x() + radius2.w(), mem.corner.y() + radius2.h())
            elem.pivot.center(elem.center())
            elem.radius(radius2)
            //elem.buildPath()
            editor.draw()
        },
        next: [2, 3, 4],
        saveEvent: false
    },
    4: {
        event: 'mousewheel',
        callback: function (editor, elem, parent, events, e, mem) {
            let inc
            if (e.deltaY > 0) {
                inc = -1
            } else {
                inc = 1
            }
            elem.width(Math.max(1, elem.width() + inc));
            editor.draw();
        },
        next: [2, 3, 4],
        saveEvent: false
    }
}