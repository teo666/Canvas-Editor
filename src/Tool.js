'use strict'

class Tool {
    constructor() {
        this.activeTool = 'pan'
        this.tools = {
            [Tool.validTools.pointer]: new Pointer(),
            [Tool.validTools.pan]: new Pan(),
            [Tool.validTools.adder]: new Adder(),
            [Tool.validTools.colors]: new Colors(),
            [Tool.validTools.canvasStyle]: new CanvasStyle()
        }
    }

    reset() {
        this.activeTool = Tool.validTools.pan
    }

    changeTool(editor,tool) {
        if (tool in Tool.validTools) {
            this.tools[this.activeTool].cancel(editor)
            this.activeTool = tool
        } else {
            throw "Not a valid Tool"
        }
    }

    dispatch(editor, etype, e) {

        let t = this.tools[this.activeTool]
        let m = t[EventUtil.EvtToMethod[etype]]
        let mod = EventUtil.getModifiers(e)

        if (etype == EventUtil.EvtType.mousewheel && EventUtil.matchMask(mod, EventUtil.Modifiers.CTRL)) {
            this.tools.pan[EventUtil.EvtToMethod[etype]].call(this.tools.pan, editor, etype, e)
            return
        }
        if (m) {
            m.call(t, editor, etype, e)
        }
    }

    /*getModifiers(e) {
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
    }*/
}

Object.defineProperty(Tool, 'validTools', {
    value: {
        'pan': 'pan',
        'pointer': 'pointer',
        'adder': 'adder',
        'colors': 'colors',
        'canvasStyle': 'canvasStyle'
    }
})

class EventUtil {
    constructor() {

    }

    static getModifiers(e) {
        let m = 0;
        if (e.ctrlKey) {
            m |= EventUtil.Modifiers.CTRL;
        }
        if (e.altKey) {
            m |= EventUtil.Modifiers.ALT;
        }
        if (e.shiftKey) {
            m |= EventUtil.Modifiers.SHIFT;
        }
        if (e.metaKey) {
            m |= EventUtil.Modifiers.META;
        }
        return m
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
    'MIDDLE': 1,
    'RIGHT': 2,
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