'use strict'

class Pointer {
    constructor() {
        this.eventToolTarget = null
    }

    eventTarget(obj) {
        this.eventToolTarget = obj
    }

    onMouseDown(editor, etype, e) {
        let rect = e.target.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        let list = editor.world.hitTest(x, y, editor.context,editor.canvas)
        if(list.length){

            const evt = new CustomEvent("propchange", {
                detail: {
                    obj: list[list.length - 1]
                }
            });
            this.eventToolTarget.dispatchEvent(evt);
        }
    }
}