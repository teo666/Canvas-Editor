'use strict'

class Tool {
    constructor() {
        this.activeTool = 'pan'
        this.tools = {
            pointer: new Pointer(),
            pan: new Pan(),
            adder: new Adder(),
            colors: new Colors(),
            canvasStyle: new CanvasStyle()
        }
    }

    reset() {
        this.activeTool = 'pan'
    }

    dispatch(editor, etype, e) {
        let t = this.tools[this.activeTool]
        let m = t[EventUtil.EvtToMethod[etype]]
        let mod = this.getModifiers(e)

        if (etype == EventUtil.EvtType.mousewheel && EventUtil.matchMask(mod, EventUtil.Modifiers.CTRL)) {
            this.tools.pan[EventUtil.EvtToMethod[etype]].call(this.tools.pan, editor, etype, e)
            return
        }
        if (m) {
            m.call(t, editor, etype, e)
        }
    }

    getModifiers(e) {
        let m = 0;
        /*if (e.ctrlKey) {
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
        //return m;*/
        return m |= (e.ctrlKey << EventUtil.Modifiers.CTRL) != (e.altKey << EventUtil.Modifiers.ALT) != (e.shiftKey << EventUtil.Modifiers.SHIFT) != (e.metaKey << EventUtil.Modifiers.META)
    }
}

class EventUtil {
    constructor() {

    }

    static getModifiers(e) {
        let m = 0;
        return m |= (e.ctrlKey << EventUtil.Modifiers.CTRL) != (e.altKey << EventUtil.Modifiers.ALT) != (e.shiftKey << EventUtil.Modifiers.SHIFT) != (e.metaKey << EventUtil.Modifiers.META)
    }

    static matchMask(val, ...mod) {
        let v = 0;
        mod.forEach(n => {
            v |= n;
        })
        return !(val ^ v)
    }
}

EventUtil.Modifiers = Object.freeze({
    'NONE': 0,
    'CTRL': 1,
    'ALT': 2,
    'SHIFT': 4,
    'META': 8
})

EventUtil.Buttons = Object.freeze({
    'NONE': 0,
    'LEFT': 1,
    'RIGHT': 2,
    'MIDDLE': 4,
    'BACK': 8,
    'FORWARD': 16
})

EventUtil.Button = Object.freeze({
    'LEFT': 0,
    'RIGHT': 1,
    'MIDDLE': 2,
    'BACK': 3,
    'FORWARD': 4
})

EventUtil.EvtType = Object.freeze({
    'mousedown': 'mousedown',
    'mouseup': 'mouseup',
    'mousemove': 'mousemove',
    'mouseleave': 'mouseleave',
    'mousewheel': 'mousewheel',
    'mousedblclick': 'mousedblclick',
    'keyup': 'keyup',
})

EventUtil.EvtToMethod = Object.freeze({
    'mousedown': 'onMouseDown',
    'mouseup': 'onMouseUp',
    'mousemove': 'onMouseMove',
    'mouseleave': 'onMouseLeave',
    'mousewheel': 'onMouseWheel',
    'mousedblclick': 'onMouseDblclick',
    'keyup': 'onKeyUp',
}) 