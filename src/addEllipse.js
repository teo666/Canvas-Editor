__addEllipse = {
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
        },
        next: [2, 3],
        saveEvent: false
    },

    2: {
        //setta l'angolo1
        event: 'mouseup',
        callback: function (elem, parent, events, current_ev, mem) {
            let p = math.multiply(math.inv(math.multiply(parent.getParentsTransformations, parent.getTransformation)), [current_ev.detail.snap_x, current_ev.detail.snap_y, 1]).valueOf()
            
            let radius = Point2D.subtract(elem.center(), new Point2D(p[0], p[1])).abs().toSize2D()

            elem.radius(radius)
            elem.buildPath()
            editor.draw()
        },
        next: [],
        saveEvent: false
    },
    3: {
        event: 'mousemove',
        callback: function (elem, parent, events, current_ev, mem) {
            let p = math.multiply(math.inv(math.multiply(parent.getParentsTransformations, parent.getTransformation)), [current_ev.detail.snap_x, current_ev.detail.snap_y, 1]).valueOf()
            
            let radius = Point2D.subtract(elem.center(), new Point2D(p[0], p[1])).abs().toSize2D()

            elem.radius(radius)
            elem.buildPath()
            editor.draw()
        },
        next: [2,3],
        saveEvent: false
    }

}