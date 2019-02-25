__addSquare = {
    0: {
        next: [1]
    },
    1: {
        event: 'mouseup',
        callback: function (elem, parent, events, current_ev) {
            elem.pending = false;
            //console.log('esecuzione callback mouseup', args.length)
            let p = math.multiply(math.inv(math.multiply(parent.getParentsTransformations, parent.getTransformation)), [current_ev.detail.snap_x, current_ev.detail.snap_y, 1]).valueOf()
            elem.corner(1, p[0], p[1]);
            elem.corner(2, p[0], p[1]);
            elem.corner(3, p[0], p[1]);
            elem.corner(4, p[0], p[1]);
            editor.draw();
        },
        next: [2, 3],
        saveEvent: true
    },

    2: {
        event: 'mouseup',
        callback: function (elem, parent, events, current_ev) {
            let p = math.multiply(math.inv(math.multiply(parent.getParentsTransformations, parent.getTransformation)), [current_ev.detail.snap_x, current_ev.detail.snap_y, 1]).valueOf()
            elem.corner(2, p[0], p[1]);
            let diff = Point2D.subtract(elem.corner(1), elem.corner(2))
            elem.side = math.hypot(diff.x(), diff.y())
            editor.draw();
        },
        next: [4, 5],
        saveEvent: true
    },
    3: {
        event: 'mousemove',
        callback: function (elem, parent, events, current_ev) {
            //console.log('esecuzione callback mousemove', args)
            let p = math.multiply(math.inv(math.multiply(parent.getParentsTransformations, parent.getTransformation)), [current_ev.detail.snap_x, current_ev.detail.snap_y, 1]).valueOf()
            elem.corner(2, p[0], p[1]);
            editor.draw();
        },
        next: [2, 3],
        saveEvent: false
    },
    4: {
        event: 'mousemove',
        callback: function (elem, parent, events, current_ev) {
            //console.log('esecuzione callback mousemove', args)
            let p = math.multiply(math.inv(math.multiply(parent.getParentsTransformations, parent.getTransformation)), [current_ev.detail.x, current_ev.detail.y, 1]).valueOf()
            let r = Point2D.isUp(elem.corner(1), elem.corner(2), new Point2D(p[0], p[1]))
            let s = math.sign(r.distance)
            if (!s) {
                s = 1
            }
            elem.corner(3, elem.corner(2).x() + elem.side * r.dx * s, elem.corner(2).y() + elem.side * r.dy * s);
            elem.corner(4, elem.corner(1).x() + elem.side * r.dx * s, elem.corner(1).y() + elem.side * r.dy * s);
            editor.draw();

        },
        next: [4, 5],
        saveEvent: false
    },
    5: {
        event: 'mouseup',
        callback: function (elem, parent, events, current_ev) {
            editor.draw();
        },
        next: [],
        saveEvent: true
    },

}