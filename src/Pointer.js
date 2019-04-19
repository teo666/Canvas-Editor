'use strict'

class Pointer {
    constructor() {
        this.eventToolTarget = null
        this.permanentTarget = null
    }

    cancel(editor) {
        this.disableAllControlPoint()
        editor.clearForeground()
        editor.drawForeground()
        this.unselectAll()
        this.removeProp()

    }

    setPermanentTarget(t) {
        this.permanentTarget = t
    }

    cancelPermanentTarget() {
        this.permanentTarget = null
    }

    eventTarget(obj) {
        this.eventToolTarget = obj
    }

    onMouseMove(editor, etype, e) {
        if (this.permanentTarget) {
            this.permanentTarget.onMouseMove(editor, etype, e, this)
            return
        }
        let selected;

        if (e.region) {
            selected = [this.select(e.region)]
            //console.log('hitRegion primitive')
        } else {
            let rect = e.target.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;
            selected = editor.world.hitTest(x, y, editor.contextes, editor.canvas)
            //console.log('hittest')
        }
        if (selected.length) {
            switch (selected[selected.length - 1].type) {
                case 'Element':

                    break;
                case 'ControlElement':
                    selected[selected.length - 1].el.onMouseMove(editor, etype, e, this)
                    break;
            }
        }
    }

    onMouseUp(editor, etype, e) {
        if (this.permanentTarget) {
            this.permanentTarget.onMouseUp(editor, etype, e, this)
            return
        }
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

                    break;
                case 'ControlElement':
                    selected[selected.length - 1].el.onMouseUp(editor, etype, e, this)
                    break;
            }
        }
    }

    onMouseDown(editor, etype, e) {
        if (this.permanentTarget) {
            this.permanentTarget.onMouseDown(editor, etype, e, this)
            return
        }
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
                    selected[selected.length - 1].el.edit(editor.contextes)
                    const evt = new CustomEvent("propchange", {
                        detail: {
                            obj: selected[selected.length - 1].el
                        }
                    });
                    this.eventToolTarget.dispatchEvent(evt);
                    break;
                case 'ControlElement':
                    selected[selected.length - 1].el.onMouseDown(editor, etype, e, this)
                    break;
            }
        } else {
            this.removeProp()
            this.disableAllPivot()
            this.disableAllControlPoint()
            this.unselectAll()
            editor.clearForeground()
            editor.drawForeground()
        }
    }

    removeProp(){
        const evt = new CustomEvent("propchange", {
            detail: {
                obj: null
            }
        });
        this.eventToolTarget.dispatchEvent(evt);
    }

    select(id) {
        const type = ElementType.Type[id.substring(0, 4)]
        const ids = id.substring(4, id.length)

        return { el: type._elements[ids], type: type.prototype.constructor.name }

    }

    unselectAll(){
        for (const i in Element._elements) {
            Element._elements[i].selected = false
        }
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