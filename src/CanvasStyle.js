'use strict'

class CanvasStyle {
    constructor(...args) {
        this.linearGradients = {};
        this.radialGradients = {};
        this.lineDashes = {};
    }

    //only chromium
    /*static lineCap = Object.freeze({
        "Butt": "butt",
        "Round": "round",
        "Square": "square"
    })

    static lineJoin = Object.freeze({
        "Bavel": "bevel",
        "Round": "round",
        "Miter": "miter"
    })
*/
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

CanvasStyle.lineCap = Object.freeze({
    "Butt": "butt",
    "Round": "round",
    "Square": "square"
})

CanvasStyle.lineJoin = Object.freeze({
    "Bavel": "bevel",
    "Round": "round",
    "Miter": "miter"
})

CanvasStyle.globalCompositeOperation = Object.freeze({
    "source_over": "source-over",
    "source_in": "source-in",
    "source_out": "source-out",
    "source_atop": "source-atop",
    "destination_over": "destination-over",
    "destination_in": "destination-in",
    "destination_out": "destination-out",
    "destination_atop": "destination-atop",
    "lighter": "lighter",
    "copy": "copy",
    "xor": "xor",
    "multiply": "multiply",
    "screen": "screen",
    "overlay": "overlay",
    "darken": "darken",
    "lighten": "lighten",
    "color_dodge": "color-dodge",
    "color_burn": "color-burn",
    "hard_light": "hard-light",
    "soft_light": "soft-light",
    "difference": "difference",
    "exclusion": "exclusion",
    "hue": "hue",
    "saturation": "saturation",
    "color": "color",
    "luminosity": "luminosity"
})