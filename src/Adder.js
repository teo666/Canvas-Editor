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
        // il controllo che non stia gia aggiungendo mi reviene eventuali inserimenti multipli dovuti a cambio di tool
        // TODO: sarebbe meglio far si' che il tool chami un medoto reset che permette di uscire dallo stato sospeso in modo pulito(???)
        if(!this.adding){
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

    cancel(editor) {
        let els = this.parentElement.getElements();
        let index = els.indexOf(this.pending)
        els.splice(index, 1)
        this.continuosAdd = false
        this.resetAdd(editor);
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

    resetAdd(editor) {
        this.descriptor = null;
        this.pending.pending = false;
        this.pending = null;
        this.mem = {};
        this.adding = false;
        if (this.continuosAdd) {
            this.add(this.pendingType, this.parentElement, this.continuosAdd)
            editor.tool.activeTool = 'adder'
        } else {
            this.parentElement = null;
            editor.tool.reset()
        }
    }

    eventProcess(editor, etype, e) {
        if (!this.isAdding()) {
            return;
        }

        let cancel
        let index = this.allowedEvents.indexOf(etype)
        if (index != -1) {
            this.state = this.descriptor[this.allowedEventsNum[index]];
            if (this.state.saveEvent) {
                this.completeEventRegister.push(e);
            }
            if (this.state.callback && typeof this.state.callback == 'function') {
                cancel = this.state.callback(editor, this.pending, this.parentElement, this.completeEventRegister, e,this.mem);
            }
            if (!cancel) {
                this.clearAllowedEvents();
                this.readAllowedEvents();
            }
            if(this.allowedEvents.length == 0) {
                this.resetAdd(editor)
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
                    this.cancel(editor);
                    editor.draw()
                }
                break;
            default:
                this.eventProcess(...arguments)
                break;
        }
    }
}
