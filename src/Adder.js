'use strict'

const shapeType = {
    0: "Point2D",
    1: "Line",
    2: "Ellipse",
    3: "Net",
    "Point2D": 0,
    "Line": 1,
    "Ellipse": 2,
    "Net": 3
}

class Adder {
    constructor() {
        this.adding = false;
        this.completeEventRegister = [];
        this.state = -1;
    }

    getCursor(){
        return this.cursor;
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
                this.addLine(parent)
                break;
            case shapeType.Net:
                this.addNet(parent);
                break;
        }
        this.prepare(parent)
    }

    prepare(p){
        this.clearCompleteEventRegister()
        //prevent rendering
        this.pending.pending = true;
        this.parentElement = p;
        this.parentElement.addElement(this.pending)

        this.state = this.descriptor[0];

        this.clearAllowedEvents()
        this.readAllowedEvents();
    }

    addLine() {
        this.descriptor = __addLine;
        this.pending = new Line();
        this.pendingType = shapeType.Line;
    }

    //necessita di ottenere due eventi di mouseup
    addNet() {
        this.descriptor = __addNet;
        this.pending = new Net();
        this.pendingType = shapeType.Net;
    }

    cancel() {
        let els = this.parentElement.getElements();
        let index = els.indexOf(this.pending)
        els.splice(index, 1)
        this.resetAdd();
    }

    clearAllowedEvents() {
        this.allowedEvents = []
        this.allowedEventsNum = []
    }

    readAllowedEvents() {
        this.state.next.forEach(element => {
            this.allowedEvents.push(this.descriptor[element].event);
            this.allowedEventsNum.push(element);
        });
    }

    clearCompleteEventRegister() {
        this.completeEventRegister = [];
    }

    resetAdd() {
        this.adding = false;
        this.descriptor = null;
        this.pending.pending = false;
        this.pending = null;
        this.parentElement = null;
    }

    eventProcess(e) {
        if (!this.isAdding()) {
            return;
        }

        let index = this.allowedEvents.indexOf(e.type)
        if (index != -1) {
            this.state = this.descriptor[this.allowedEventsNum[index]];
            if (this.state.saveEvent) {
                this.completeEventRegister.push(e);
            }
            if (this.state.callback && typeof this.state.callback == 'function') {
                this.state.callback(this.pending, this.parentElement, this.completeEventRegister, e);
            }
            this.clearAllowedEvents();
            this.readAllowedEvents();
            if (this.allowedEvents.length == 0) {
                this.resetAdd()
            }
        }
    }
}