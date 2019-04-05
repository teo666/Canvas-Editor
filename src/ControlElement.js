'use strict'

class ControlElement {
    constructor() {
        Object.defineProperty(this, 'id', { value: ControlElement.retriveId() })
        this.name = ("controlElement" + this.id);
        this.controlList = []
        this.enable = true
        this.enableDraw = true
    }

    addHitRegion(contextes, parentT, overrideTM = null) {
    }

    add(e) {
        if (e instanceof ControlElement) {
            this.controlList.push(e)
            return
        }
        throw "Invalid arguments"
    }

    draw(contextes, parentT) {
        for(let i = this.controlList.length - 1; i >=0; i--){
            this.controlList[i].draw(contextes, parentT)
        }
    }
}

Object.defineProperty(ControlElement, 'retriveId',
    {
        value: (function () {
            let i = 0;
            return function () {
                return i++;
            }
        })(),
        configurable: false,
        writable: false
    }
)