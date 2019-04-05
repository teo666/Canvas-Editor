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
            list[list.length - 1].controlElements.controlList[0].enableDraw = true
            editor.clearForeground()
            editor.drawForeground()
            const evt = new CustomEvent("propchange", {
                detail: {
                    obj: list[list.length - 1]
                }
            });
            this.eventToolTarget.dispatchEvent(evt);

        }
    }

    //TODO: implementare un metodo select che permette di selezionare un elemento in funzione del suo id
    select(){

    }

    disableAllPivot() {
        for (const i in Element._elements) {
            Element._elements[i].controlElements.controlList[0].enableDraw = false
        }

    }
}