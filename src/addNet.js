__addNet = {
    0: {
        next : [1]
    },
    1: {
        event: 'mouseup',
        callback: function (elem, parent, events, current_ev) {
            elem.pending = false;
            //console.log('esecuzione callback mouseup', args.length)
            let p = math.multiply(math.inv(math.multiply(parent.getParentsTransformations, parent.getTransformation)), [current_ev.detail.x, current_ev.detail.y, 1]).valueOf()
            elem.setStart(p[0], p[1]);
            elem.setEnd(p[0], p[1]);
            editor.draw();
        },
        next: [2],
        saveEvent : true
    },

    2: {
        event: 'mousemove',
        callback: function (elem, parent, events, current_ev) {
            //console.log('esecuzione callback mousemove', args)
            let p = math.multiply(math.inv(math.multiply(parent.getParentsTransformations, parent.getTransformation)), [current_ev.detail.x, current_ev.detail.y, 1]).valueOf()
            elem.setEnd(p[0], p[1]);
            editor.draw();
        },
        next: [2, 3, 4],
        saveEvent : false
    },
    3: {
        event: 'mousewheel',
        callback: function (elem, parent, events, current_ev) {
            let inc
            if(current_ev.detail.dy > 0){
                inc = -1
            } else {
                inc = 1
            }
            elem.width(Math.max(1,elem.width()+inc));
            editor.draw();
        },
        next: [2, 3, 4],
        saveEvent : false
    },
    4: {
        event: 'mouseup',
        callback: function (elem, parent, events, current_ev) {
            //console.log("net add ", args)
            editor.draw()
            //editor.adder.add(shapeType.Net, parent)
            //editor.adder.eventProcess(current_ev)
        },
        next: [],
        saveEvent : true
    }
}