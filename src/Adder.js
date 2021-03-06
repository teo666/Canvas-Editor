'use strict'

const shapeType = {
    0: "Point2D",
    1: "Line",
    2: "Ellipse",
    3: "Net",
    4: "Rectangle",
    5: "Square",
    6: "Arc",
    7: "Bezier",
    8: "QuadraticCurve",
    "Point2D": 0,
    "Line": 1,
    "Ellipse": 2,
    "Net": 3,
    "Rectangle": 4,
    "Square": 5,
    "Arc": 6,
    "Bezier": 7,
    "QuadraticCurve":8
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

    add(type, parent, descriptor = null, continuosAdd = false) {
        if (!this.adding) {
            this.continuosAdd = continuosAdd
            this.adding = true;
            switch (type) {
                case shapeType.Point2D:
                    break;
                case shapeType.Ellipse:
                    this.addEllipse(descriptor)
                    break;
                case shapeType.Line:
                    this.addLine(descriptor)
                    break;
                case shapeType.Net:
                    this.addNet(descriptor);
                    break;
                case shapeType.Rectangle:
                    this.addRectangle(descriptor);
                    break;
                case shapeType.Square:
                    this.addSquare(descriptor);
                    break;
                case shapeType.Arc:
                    this.addArc(descriptor);
                    break;
                    case shapeType.Bezier:
                    this.addBezier(descriptor);
                    break;
                    case shapeType.QuadraticCurve:
                    this.addQuadraticCurve(descriptor);
                    break;
            }
            this.prepare(parent)
        }
    }

    prepare(p) {
        this.clearCompleteEventRegister()
        //prevent rendering
        this.pending.disable()
        this.pending.add(true)
        this.parentElement = p;
        this.parentElement.addElement(this.pending)

        this.state = this.descriptor[0];

        this.mem = {}

        this.clearAllowedEvents()
        this.readAllowedEvents();
    }

    addQuadraticCurve(descriptor) {
        this.descriptor = descriptor ? descriptor : __addQuadraticCurve;
        this.pending = new QuadraticCurve();
        this.pendingType = shapeType.QuadraticCurve;
    }

    addBezier(descriptor) {
        this.descriptor = descriptor ? descriptor : __addBezier;
        this.pending = new Bezier();
        this.pendingType = shapeType.Bezier;
    }

    addEllipse(descriptor) {
        this.descriptor = descriptor ? descriptor : __addEllipse;
        this.pending = new Ellipse();
        this.pendingType = shapeType.Ellipse;
    }

    addLine(descriptor) {
        this.descriptor = descriptor ? descriptor : __addLine;
        this.pending = new Line();
        this.pendingType = shapeType.Line;
    }

    //necessita di ottenere due eventi di mouseup
    addNet(descriptor) {
        this.descriptor = descriptor ? descriptor : __addNet;
        this.pending = new Net();
        this.pendingType = shapeType.Net;
    }

    addRectangle(descriptor) {
        this.descriptor = descriptor ? descriptor : __addRectangle;
        this.pending = new Rectangle();
        this.pendingType = shapeType.Rectangle;
    }

    addSquare(descriptor) {
        this.descriptor = descriptor ? descriptor : __addSquare;
        this.pending = new Quadrangle();
        this.pendingType = shapeType.Square;
    }

    addArc(descriptor) {
        this.descriptor = descriptor ? descriptor : __addArc;
        this.pending = new Arc();
        this.pendingType = shapeType.Arc;
    }

    cancel(editor) {
        let els = this.parentElement.getElements();
        let index = els.indexOf(this.pending)
        if (index > 0) {
            els.splice(index, 1)
        }
        this.continuosAdd = false
        this.adding = false
        //this.resetAdd(editor);
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
        this.pending.add(false);
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
                cancel = this.state.callback(editor, this.pending, this.parentElement, this.completeEventRegister, e, this.mem);

                /**
                 * adding element are redendered on foreground canvas
                 * foreground is cleared and draw called 
                 * TODO: make method to call it from extern
                 */
                editor.clearForeground()
                this.pending.draw(editor.contextes, this.parentElement.transformation)
                editor.drawForeground()
            }
            if (this.state.postDraw && typeof this.state.postDraw == 'function') {
                this.state.postDraw(editor, this.pending, this.parentElement, this.completeEventRegister, e, this.mem);
            }
            if (!cancel) {
                this.clearAllowedEvents();
                this.readAllowedEvents();
            }
            if (this.allowedEvents.length == 0) {
                this.pending.selected = false
                this.resetAdd(editor)
                editor.clearForeground()
                editor.drawForeground()
                editor.draw()
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
                    this.resetAdd(editor)
                    //editor.draw()
                    editor.clearForeground()
                    editor.drawForeground()
                }
                break;
            default:
                this.eventProcess(...arguments)
                break;
        }
    }
}
