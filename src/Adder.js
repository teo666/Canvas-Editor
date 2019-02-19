'use strict'

const shapeType = {
    0: "Point2D",
    1: "Line",
    2: "Ellipse",
    3: "Net",
    "Point2D" : 0,
    "Line" : 1,
    "Ellipse" : 2,
    "Net" : 3
}

class Adder {
    constructor() {
        this.cursor = null
        this.adding = true;
        this.eventRegister = [];
        this.callbackRegister = [];
        this.eventSave = [];
        this.completeEventRegister = [];
        this.listener = document.createElement("adder")
        this.listener.addEventListener('mouseup', e => { this.eventConsumer(e) }, false);
        this.listener.addEventListener('mousemove', e => { this.eventConsumer(e) }, false);
    }

    dispatchEvent(e) {
        this.listener.dispatchEvent(e)
    }

    setCursor(c) {
        this.cursor = c;
    }

    isAdding() {
        return this.adding;
    }

    add(type, parent) {
        this.adding = true;
        switch (type) {
            case shapeType.Point2D:
                break;
            case shapeType.Ellipse:
                break;
            case shapeType.Line:
                break;
            case shapeType.Net:
                this.addNet(parent);
                break;
        }
    }

    //necessita di ottenere due eventi di mouseup
    addNet(p) {
        this.clearEventRegister();
        this.clearCompleteEventRegister()
        this.registerEvent.apply(this, addNet.events);
        this.registerCallback.apply(this, addNet.callbacks);
        this.registerSave.apply(this, addNet.eventSave);
        this.pending = new Net();
        //prevent rendering
        this.pending.pending = true;
        this.pendingType = shapeType.Net;
        this.parentElement = p; 
        editor.world.addElement(this.pending)
    }

    clearEventRegister() {
        this.eventRegister = [];
    }
    clearCompleteEventRegister() {
        this.completeEventRegister = [];
    }

    clearEventSave(){
        this.eventSave = []
    }

    registerSave(...save) {
        save.forEach(element => {
            this.eventSave.push(element);
        });
    }

    registerEvent(...evt) {
        evt.forEach(element => {
            this.eventRegister.push(element);
        });
    }

    registerCallback(...cb) {
        cb.forEach(element => {
            this.callbackRegister.push(element);
        });
    }

    eventConsumer(e) {
        if (this.eventRegister.length > 0) {
            let s = this.eventRegister[0].split(" ")
            if (e.type == s[0]) {
                let cb = this.callbackRegister[0];
                if (this.eventSave[0]) {
                    this.completeEventRegister.push(e);
                }
                if (!(s.length > 1 && s[1] == 'multi')) {
                    this.callbackRegister.shift();
                    this.eventRegister.shift();
                    this.eventSave.shift();
                }
                if (cb && typeof cb == 'function') {
                    cb(this.pending, this.parentElement, this.completeEventRegister, e);
                }
            } else if (this.eventRegister.length > 1 && e.type == this.eventRegister[1].split(' ')[0] && this.eventRegister[0].split(' ')[1] == 'multi') {
                this.callbackRegister.shift();
                this.eventRegister.shift();
                this.eventSave.shift();
                this.eventConsumer(e);
            }

        }
    }
}