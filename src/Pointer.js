'use strict'

class Pointer {
    constructor() {
        this.eventToolTarget = null
    }

    cancel(){
        
    }

    eventTarget(obj) {
        this.eventToolTarget = obj
    }

    onMouseMove(editor, etype, e) {
        if (e.region != null) {
            console.log(e.region)
        }
    }

    onMouseDown(editor, etype, e) {
        let selected;

        if (e.region) {
            selected = [this.select(e.region)]
            console.log('hitRegion primitive')
        } else {
            let rect = e.target.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;
            selected = editor.world.hitTest(x, y, editor.contextes, editor.canvas)
            console.log('hittest')
        }
        if (selected.length) {
            switch (selected[selected.length - 1].type) {
                case 'Element':
                    selected[selected.length - 1].el.selected = true
                    //this.disableAllPivot()
                    this.disableAllControlPoint()
                    //selected[selected.length - 1].el.enablePivot(true)
                    selected[selected.length - 1].el.controls.enableControlPoints(true)

                    editor.clearForeground()
                    editor.drawForeground()
                    const evt = new CustomEvent("propchange", {
                        detail: {
                            obj: selected[selected.length - 1].el
                        }
                    });
                    this.eventToolTarget.dispatchEvent(evt);
                    break;
                case 'ControlElement':

                    break;
            }
        } else {
            const evt = new CustomEvent("propchange", {
                detail: {
                    obj: null
                }
            });
            this.eventToolTarget.dispatchEvent(evt);
            this.disableAllPivot()
            this.disableAllControlPoint()
            editor.clearForeground()
            editor.drawForeground()
        }
    }

    select(id) {
        const type = ElementType.Type[id.substring(0, 4)]
        const ids = id.substring(4, id.length)

        return { el: type._elements[ids], type: type.prototype.constructor.name }

    }

    disableAllPivot() {
        for (const i in Element._elements) {
            Element._elements[i].controls.list[0].enableDraw = false
        }
    }

    disableAllControlPoint() {
        for (const i in ControlElement._elements) {
            ControlElement._elements[i].enableDraw = false
        }
    }
}