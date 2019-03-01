__addLine = {
    0: {
        next: [1]
    },
    1: {
        event: 'mousedown',
        callback: function (editor, elem, parent, events, current_ev) {
            elem.pending = false;
            //console.log('esecuzione callback mouseup', args.length)
            //let p = math.multiply(math.inv(math.multiply(parent.getParentsTransformations, parent.getTransformation)), [current_ev.detail.snap_x, current_ev.detail.snap_y, 1]).valueOf()
            let p = elem.getParentsTransformations()
            p = p.inv()
            p = p.multiplyPoint(current_ev.detail.snap_x, current_ev.detail.snap_y)
            elem.start(p[0], p[1]);
            elem.end(p[0], p[1]);
            editor.draw();
        },
        next: [2, 3, 4],
        saveEvent: false
    },

    2: {
        event: 'mousemove',
        callback: function (editor, elem, parent, events, current_ev) {
            //console.log('esecuzione callback mousemove', args)
            //let p = math.multiply(math.inv(math.multiply(parent.getParentsTransformations, parent.getTransformation)), [current_ev.detail.snap_x, current_ev.detail.snap_y, 1]).valueOf()
            let p = elem.getParentsTransformations().inv().multiplyPoint(current_ev.detail.snap_x, current_ev.detail.snap_y)
            elem.end(p[0], p[1]);
            elem.enableDraw = !(elem.end().equal(elem.start())) 
            editor.draw();
        },
        next: [2, 3, 4],
        saveEvent: false
    },
    3: {
        event: 'mousewheel',
        callback: function (editor, elem, parent, events, current_ev) {
            let inc
            if (current_ev.detail.dy > 0) {
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
        callback: function (editor, elem, parent, events, current_ev) {
            //console.log("net add ", args)
            let p = elem.getParentsTransformations().inv().multiplyPoint(current_ev.detail.snap_x, current_ev.detail.snap_y)
            elem.end(p[0], p[1]);
            if (elem.end().equal(elem.start())) {
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