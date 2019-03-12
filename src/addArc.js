const __addArc = {
    0: {
        next: [1]
    },
    1: {
        //setta il centro
        event: 'mouseup',
        callback: function (elem, parent, events, current_ev, mem) {
            elem.pending = false;

            let p = math.multiply(math.inv(math.multiply(parent.getParentsTransformations, parent.getTransformation)), [current_ev.detail.snap_x, current_ev.detail.snap_y, 1]).valueOf()
            elem.center(p[0], p[1]);
            editor.draw();
        },
        next: [2, 3],
        saveEvent: true
    },

    2: {
        //setta l'angolo1
        event: 'mouseup',
        callback: function (elem, parent, events, current_ev, mem) {
            let p = math.multiply(math.inv(math.multiply(parent.getParentsTransformations, parent.getTransformation)), [current_ev.detail.snap_x, current_ev.detail.snap_y, 1]).valueOf()
            let start = new Point2D(p[0], p[1])
            let angle1 = Point2D.angle(elem.center(), start)
            elem.startAngle(angle1)
            elem.endAngle(angle1 + math.pi)
            elem.radius(Point2D.hypot(elem.center(), start))
            elem.buildPath()
            editor.draw()
        },
        next: [4, 5],
        saveEvent: true
    },
    3: {
        event: 'mousemove',
        callback: function (elem, parent, events, current_ev, mem) {
            let p = math.multiply(math.inv(math.multiply(parent.getParentsTransformations, parent.getTransformation)), [current_ev.detail.snap_x, current_ev.detail.snap_y, 1]).valueOf()
            let angle1 = Point2D.angle(elem.center(), new Point2D(p[0], p[1]))
            mem['angle1'] = angle1
            elem.startAngle(angle1)
        },
        next: [2, 3],
        saveEvent: true
    },
    4: {
        //setta l'angolo2
        event: 'mouseup',
        callback: function (elem, parent, events, current_ev, mem) {
            let p = math.multiply(math.inv(math.multiply(parent.getParentsTransformations, parent.getTransformation)), [current_ev.detail.snap_x, current_ev.detail.snap_y, 1]).valueOf()
            let angle2 = Point2D.angle(elem.center(), new Point2D(p[0], p[1]))
            if (angle2 == mem.angle1) {
                angle2 = mem.angle1 + math.pi * 2
            }
            elem.endAngle(angle2)
            elem.buildPath()
            editor.draw();
        },
        next: [],
        saveEvent: true
    },
    5: {
        //setta l'angolo
        event: 'mousemove',
        callback: function (elem, parent, events, current_ev, mem) {
            let p = math.multiply(math.inv(math.multiply(parent.getParentsTransformations, parent.getTransformation)), [current_ev.detail.snap_x, current_ev.detail.snap_y, 1]).valueOf()
            let angle2 = Point2D.angle(elem.center(), new Point2D(p[0], p[1]))
            if (angle2 == mem.angle1) {
                angle2 = mem.angle1 + math.pi * 2
            }
            elem.endAngle(angle2)
            elem.buildPath()
            editor.draw();
        },
        next: [4, 5],
        saveEvent: true
    },

}