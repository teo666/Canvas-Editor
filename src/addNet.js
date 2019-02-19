addNet = {
    events: ["mouseup", "mousemove multi", "mouseup"],
    eventSave: [true, false, true],
    callbacks: [
        function (elem, parent, args, current_ev) {
            let snap = 5
            elem.pending = false;
            //console.log('esecuzione callback mouseup', args.length)
            let p = math.multiply(math.inv(math.multiply(parent.getParentsTransformations, parent.getTransformation)), [current_ev.detail.x, current_ev.detail.y, 1]).valueOf()
            let x = math.round(p[0] / snap) * snap
            let y = math.round(p[1] / snap) * snap
            elem.setStart(x, y);
            elem.setEnd(x, y);
            editor.draw();
        },
        function (elem, parent, args, current_ev) {
            let snap = 5
            //console.log('esecuzione callback mousemove', args)
            let p = math.multiply(math.inv(math.multiply(parent.getParentsTransformations, parent.getTransformation)), [current_ev.detail.x, current_ev.detail.y, 1]).valueOf()
            let x = math.round(p[0] / snap) * snap
            let y = math.round(p[1] / snap) * snap
            elem.setEnd(x, y);
            editor.draw();
        },
        function (elem, parent, args, current_ev) {
            //console.log("net add ", args)
            editor.draw()
            editor.adder.add(shapeType.Net, parent)
            editor.adder.eventConsumer(current_ev)
        }
    ]
}