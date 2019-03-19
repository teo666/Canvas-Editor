const __addRectangle = {
    0: {
        next: [1]
    },
    1: {
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
            elem.corner(p[0], p[1]);
            elem.size(0, 0)
            elem.pivot.center(p[0], p[1])
            editor.draw();
        },
        next: [2, 3, 4],
        saveEvent: false
    },

    2: {
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
            //console.log(mmv)
            let p = elem.getParentsTransformations().inv().multiplyPoint(mmv.snap_x, mmv.snap_y)
            elem.size(p[0] - elem.corner().x(), p[1] - elem.corner().y());
            elem.pivot.center((elem.corner().x() + p[0]) / 2, (elem.corner().y() + p[1]) / 2)
            editor.draw();
        },
        next: [2, 3, 4],
        saveEvent: false
    },
    3: {
        event: 'mousewheel',
        callback: function (editor, elem, parent, events, e, mem) {
            let rect = e.target.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;
            e.preventDefault();
            let mmv = {
                x: x,
                y: y
            }
            //editor.cursor.snapToCoordinatesSystem(mmv, editor.world.getTransformation())
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
    },
    4: {
        event: 'mouseup',
        callback: function (editor, elem, parent, events, e, mem) {
            let rect = e.target.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;
            e.preventDefault();
            if (EventUtil.Button.LEFT != e.button) {
                return true
            }
            let mmv = {
                x: x,
                y: y
            }
            editor.cursor.snapToCoordinatesSystem(mmv, editor.world.getTransformation())
            let p = elem.getParentsTransformations().inv().multiplyPoint(mmv.snap_x, mmv.snap_y)
            elem.size(p[0] - elem.corner().x(), p[1] - elem.corner().y());
            elem.pivot.center((elem.corner().x() + p[0]) / 2, (elem.corner().y() + p[1]) / 2)

            if (elem.size().x() == elem.size().x() == 0) {
                //wait next event
                return true;
            }
            elem.buildHitTestPath()
            editor.draw()
            //editor.adder.add(shapeType.Net, parent)
            //editor.adder.eventProcess(current_ev)
        },
        next: [],
        saveEvent: true
    }
}