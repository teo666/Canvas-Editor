'use strict'

class Pointer {
    constructor() {
        this.eventToolTarget = null
    }

    eventTarget(obj) {
        this.eventToolTarget = obj
    }

    onMouseMove(editor, etype, e) {
        //console.log(e.region)
    }

    onMouseDown(editor, etype, e) {
        let list;

        if (e.region && Element._elements[e.region]) {
            list = [Element._elements[e.region]]
            console.log('hitRegion primitive')
        } else {
            let rect = e.target.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;
            list = editor.world.hitTest(x, y, editor.contextes, editor.canvas)
            console.log('hittest')
        }
        if (list.length) {
            list[list.length - 1].selected = true
            this.disableAllPivot()
            list[list.length - 1].pivot.enableDraw = true
            editor.world.drawPivot(editor.contextes, list[list.length - 1].getTransformation())
            const evt = new CustomEvent("propchange", {
                detail: {
                    obj: list[list.length - 1]
                }
            });
            this.eventToolTarget.dispatchEvent(evt);

        }
    }

    disableAllPivot() {
        editor.clearForground()
        for (const i in Element._elements) {
            Element._elements[i].pivot.enableDraw = false
        }

    }
}