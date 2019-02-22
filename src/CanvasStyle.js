'use strict'

class CanvasStyle {
    constructor(...args) {
        this.linearGradients = {};
        this.radialGradients = {};
        this.lineDashes = {};
    }

    addOrReplaceLinearGradients(name, e) {
        if (e instanceof CanvasGradient) {
            this.linearGradients[name] = e;
        }
    }

    addOrReplaceRadialGradients(name, e) {
        if (e instanceof CanvasGradient) {
            this.radialGradients[name] = e;
        }
    }

    addOrReplaceLineDash(name, e) {
        if (e instanceof Array) {
            if (!e.some(el => {
                if (!(typeof el == 'number')) {
                    return true;
                }
            })) {
                this.lineDashes[name] = e;
            }
        }
    }
}