'use strict'

class Tool {
    constructor() {
        this.activeTool = 'pan'
        this.tools = {
            pan: new Pan(),
            adder: new Adder(),
            colors: new Colors(),
            canvasStyle: new CanvasStyle()
        }
    }

    dispatch(editor, etype, e) {
        let t = this.tools[this.activeTool]
        let m = t[Tool.EvtToMethod[etype]]
        let mod = this.getModifiers(e)

        if(etype == Tool.EvtType.mousewheel && this.matchModifiers(mod, Tool.Mod.CTRL)){
            this.tools.pan[Tool.EvtToMethod[etype]].call(this.tools.pan,editor,etype,e)
            return
        }
        if (m) {
            m.call(t, editor, etype, e)
        }
    }

    getModifiers(e) {
        let m = 0;
        if (e.ctrlKey) {
            m |= Tool.Mod.CTRL;
        }
        if (e.altKey) {
            m |= Tool.Mod.ALT;
        }
        if (e.shiftKey) {
            m |= Tool.Mod.SHIFT;
        }
        if (e.metaKey) {
            m |= Tool.Mod.META;
        }
        return m;
    }

    matchModifiers(val, ...mod) {
        let v = 0;
        mod.forEach(n => {
            v |= n;
        })
        return !(val ^ v)
    }
}

Tool.Mod = Object.freeze({
    'NONE': 0,
    'CTRL': 1,
    'ALT': 2,
    'SHIFT': 4,
    'META': 8
})

Tool.EvtType = Object.freeze({
    'mousedown': 'mousedown',
    'mouseup': 'mouseup',
    'mousemove': 'mousemove',
    'mouseleave': 'mouseleave',
    'mousewheel': 'mousewheel',
    'mousedblclick': 'mousedblclick',
    'keyup': 'keyup',
})

Tool.EvtToMethod = Object.freeze({
    'mousedown': 'onMouseDown',
    'mouseup': 'onMouseUp',
    'mousemove': 'onMouseMove',
    'mouseleave': 'onMouseLeave',
    'mousewheel': 'onMouseWheel',
    'mousedblclick': 'onMouseDblclick',
    'keyup': 'onKeyUp',
}) 