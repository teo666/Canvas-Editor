'use strict'

const shapeType = {
    0: "Point2D",
    1: "Line",
    2: "Ellipse",
    3: "Net",
    4: "Rectangle",
    5: "Square",
    6: "Arc",
    "Point2D": 0,
    "Line": 1,
    "Ellipse": 2,
    "Net": 3,
    "Rectangle": 4,
    "Square": 5,
    "Arc": 6
}

class Adder {
    constructor() {
        this.adding = false;
        this.completeEventRegister = [];
        this.state = -1;
        this.continuosAdd = true
    }

    getCursor() {
        return this.cursor;
    }

    isAdding() {
        return this.adding;
    }

    add(type, parent, continuosAdd = false) {
        this.continuosAdd = continuosAdd
        this.adding = true;
        switch (type) {
            case shapeType.Point2D:
                break;
            case shapeType.Ellipse:
                this.addEllipse(parent)
                break;
            case shapeType.Line:
                this.addLine(parent)
                break;
            case shapeType.Net:
                this.addNet(parent);
                break;
            case shapeType.Rectangle:
                this.addRectangle(parent);
                break;
            case shapeType.Square:
                this.addSquare(parent);
                break;
            case shapeType.Arc:
                this.addArc(parent);
                break;
        }
        this.prepare(parent)
    }

    prepare(p) {
        this.clearCompleteEventRegister()
        //prevent rendering
        this.pending.pending = true;
        this.parentElement = p;
        this.parentElement.addElement(this.pending)

        this.state = this.descriptor[0];

        this.mem = {}

        this.clearAllowedEvents()
        this.readAllowedEvents();
    }

    addEllipse() {
        this.descriptor = __addEllipse;
        this.pending = new Ellipse();
        this.pendingType = shapeType.Ellipse;
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

    addRectangle() {
        this.descriptor = __addRectangle;
        this.pending = new Quadrangle();
        this.pendingType = shapeType.Rectangle;
    }

    addSquare() {
        this.descriptor = __addSquare;
        this.pending = new Quadrangle();
        this.pendingType = shapeType.Square;
    }

    addArc() {
        this.descriptor = __addArc;
        this.pending = new Arc();
        this.pendingType = shapeType.Arc;
    }

    cancel() {
        let els = this.parentElement.getElements();
        let index = els.indexOf(this.pending)
        els.splice(index, 1)
        this.continuosAdd = false
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
        this.descriptor = null;
        this.pending.pending = false;
        this.pending = null;
        this.mem = {};
        this.adding = false;
        if (this.continuosAdd) {
            this.add(this.pendingType, this.parentElement, this.continuosAdd)
        } else {
            this.parentElement = null;
        }
    }

    eventProcess(editor, etype, e) {
        if (!this.isAdding()) {
            return;
        }
        //todo rimuovere tutta sta roba dello snap e portare dentro la funzione di aggiunta elementi
        let rect = e.target.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        e.preventDefault();
        let mmv = {
            type: etype,
            detail: {
                x: x,
                y: y,
                dx: e.deltaX,
                dy: e.deltaY
            },
            evt: e
        }
        editor.cursor.snapToWorldCoordinates(mmv, editor.world.getTransformation())
        /////////
        let cancel
        let index = this.allowedEvents.indexOf(mmv.type)
        if (index != -1) {
            this.state = this.descriptor[this.allowedEventsNum[index]];
            if (this.state.saveEvent) {
                this.completeEventRegister.push(e);
            }
            if (this.state.callback && typeof this.state.callback == 'function') {
                cancel = this.state.callback(editor, this.pending, this.parentElement, this.completeEventRegister, mmv, this.mem);
            }
            this.clearAllowedEvents();
            this.readAllowedEvents();
            if (cancel) {
                this.cancel()
                editor.draw()
            } else if (this.allowedEvents.length == 0) {
                this.resetAdd()
            }
        }
    }

    onMouseDown(...arg) { this.eventProcess(...arg) }
    onMouseUp(...arg) { this.eventProcess(...arg) }
    onMouseMove(...arg) { this.eventProcess(...arg) }
    onMouseLeave(...arg) { this.eventProcess(...arg) }
    onMouseWheel(...arg) { this.eventProcess(...arg) }
    onMouseDblclick(...arg) { this.eventProcess(...arg) }

    onKeyUp(editor, etype, e) {
        switch (e.key) {
            case "Escape":
                if (this.isAdding()) {
                    this.cancel();
                    editor.draw()
                }
                break;
            default:
                this.eventProcess(...arguments)
                break;
        }
    }
}
