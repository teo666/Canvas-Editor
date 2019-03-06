'use strict'

class Editor {

    constructor(obj) {
        if (!obj) {
            throw "Invalid arguments"
        }
        if (!obj.canvas) {
            throw "Canvas has not been specify"
        }

        if (obj.canvas.nodeName != 'CANVAS') {
            throw "Not a valid canvas"
        }
        this.canvas = obj.canvas;
        this.context = this.canvas.getContext("2d");

        this.tool = new Tool();
        this.world = new World();
        this.cursor = new Cursor();
        this.cursor.snap(25)

        if (obj.gridCanvas && obj.gridCanvas.nodeName && obj.gridCanvas.nodeName == 'CANVAS') {
            this.grid = new Grid();
            this.gridCanvas = obj.gridCanvas
            this.gridContext = this.gridCanvas.getContext("2d");
            this.grid.snap(25)
        }

        this.zoom_in = 1.05;
        this.zoom_out = 1 / 1.05;
        this.zoom_inL = 1.15;
        this.zoom_outL = 1 / 1.15;
        this.rotate_angle = Math.PI / 500;
        this.rotate_angleL = Math.PI / 50;
        this.translatel = 1;
        this.translatelL = 5;

        this.drag = false;
        this.drag_point = null;
        this.is_dragging = false;

        this.element = null;

        this.addEvents()
        this.world.translate(200, 200)
        this.world.applyTransform(this.context)
        this.draw()
    }

    draw_point(x, y, r) {
        this.context.beginPath();
        this.context.arc(x, y, r, 0, 2 * Math.PI, false);
        this.context.fillStyle = 'blue';
        this.context.fill();
        this.context.strokeStyle = '#003300';
        this.context.stroke();
    };

    draw_center() {
        this.draw_point(0, 0, 1);
    };


    draw_axis() {
        this.context.lineWidth = 1 / this.world.getScaleFactor().x;
        this.context.beginPath();
        this.context.moveTo(-1000000, 0);
        this.context.lineTo(1000000, 0);
        this.context.lineWidth = 1 / this.world.getScaleFactor().y;
        this.context.moveTo(0, -1000000);
        this.context.lineTo(0, 1000000);
        this.context.stroke();
    };

    clear() {
        this.context.save();
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.restore();
    };

    draw() {
        this.clear();
        this.draw_axis();
        this.draw_center()
        this.world.draw(this.context);
        this.grid.draw(this.gridContext, this.gridCanvas.width, this.gridCanvas.height, this.gridCanvas, this.world)
    }

    addEvents() {
        this.addMouseMove();
        this.addMouseDown();
        this.addMouseLeave()
        this.addMouseUp()
        this.addMouseWheel()
        this.addMouseDoubleClick()
        this.addKeyUp()
    }

    addMouseMove() {
        let self = this;
        this.canvas.addEventListener("mousemove", function () {
            self.tool.dispatch(self, EventUtil.EvtType.mousemove, ...arguments)
        });
    }

    addMouseDown() {
        let self = this;
        this.canvas.addEventListener("mousedown", function () {
            self.tool.dispatch(self, EventUtil.EvtType.mousedown, ...arguments)
        });
    }

    addMouseUp() {
        let self = this;
        this.canvas.addEventListener("mouseup", function () {
            self.tool.dispatch(self, EventUtil.EvtType.mouseup, ...arguments)
        });
    }

    addMouseLeave() {
        let self = this;
        this.canvas.addEventListener("mouseleave", function () {
            self.tool.dispatch(self, EventUtil.EvtType.mouseleave, ...arguments)
        });
    }

    addMouseWheel() {
        let self = this;
        this.canvas.addEventListener("wheel", function () {
            self.tool.dispatch(self, EventUtil.EvtType.mousewheel, ...arguments)
        });
    }

    addMouseDoubleClick() {
        let self = this;
        this.canvas.addEventListener("dblclick", function () {
            self.tool.dispatch(self, EventUtil.EvtType.mousedblclick, ...arguments)
        });
    }

    addKeyUp() {
        let self = this;
        document.body.addEventListener("keyup", function () {
            self.tool.dispatch(self, EventUtil.EvtType.keyup, ...arguments)
        });
    }

    keyUpCallback(editor, e) {
        switch (e.key) {
            case "Escape":
                if (this.tool.adder.isAdding()) {
                    this.tool.adder.cancel();
                    this.draw()
                }
                break;
            default:
                break;
        }
    }

    /*mouseMoveCallback(editor,e) {
        let rect = e.target.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        if (this.drag) {
            this.is_dragging = true;
            let rest = {
                x: (x - this.drag_point.x),
                y: (y - this.drag_point.y)
            }
            this.world.translateAdd(rest.x, rest.y);
            this.drag_point = {
                x: x,
                y: y
            }
            this.world.applyTransform(this.context);
            this.grid.setTransformation(this.gridContext, this.world.getTransformation());
            this.draw();
        } else if (this.adder.isAdding()) {
            let mmv = {
                type: 'mousemove',
                detail: {
                    x: x,
                    y: y
                },
                evt: e
            }
            this.cursor.snapToCoordinatesSystem(mmv, this.world.getTransformation())
            this.adder.eventProcess(this, mmv);
        } else {

            e.preventDefault();
            let event = {
                x: x,
                y: y,
                parentTransformation: new TransformationMatrix()
            }
            this.world.mousemove(event);
        }
    }

    mouseDownCallback(editor,e) {
        e.preventDefault()
        let rect = e.target.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        let e_mod = this.getModifiers(e)

        if (this.adder.isAdding()) {
            if (this.matchModifiers(e_mod, Mod.NONE)) {
                let mmv = {
                    type: 'mousedown',
                    detail: {
                        x: x,
                        y: y
                    },
                    evt: e
                }
                this.cursor.snapToCoordinatesSystem(mmv, this.world.getTransformation())
                this.adder.eventProcess(this, mmv);
                //previene l'handling del drag
                return
            }
            if (this.matchModifiers(e_mod, Mod.CTRL)) {
                console.log("comportamento normale")
            }
        }
        //se tutti i valori sono sulli e sto aggiungendo un elemento mando gli eventi all'adder
        this.drag = true;
        this.drag_point = {
            x: x,
            y: y

        }
    }

    mouseUpCallback(editor,e) {
        let rect = e.target.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        if (!this.is_dragging) {
            e.preventDefault();
            if (this.adder.isAdding()) {
                let mmv = {
                    type: 'mouseup',
                    detail: {
                        x: x,
                        y: y
                    },
                    evt: e
                }
                this.cursor.snapToCoordinatesSystem(mmv, this.world.getTransformation())
                this.adder.eventProcess(this, mmv);
            } else {

                //handle hitttest
                this.element = this.world.hitTest(x, y, this.context);
                console.log(this.element)
                this.element = this.element[this.element.length - 1];
            }
        }
        this.is_dragging = false;
        this.drag = false;
    };

    mouseLeaveCallback(editor,e) {
        this.drag = false;
        this.is_dragging = false;
    };

    mouseWheelCallback(editor,e) {
        let rect = e.target.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        e.preventDefault();

        let e_mod = this.getModifiers(e)

        if (this.adder.isAdding()) {
            if (this.matchModifiers(e_mod, Mod.NONE)) {
                let mmv = {
                    type: 'mousewheel',
                    detail: {
                        x: x,
                        y: y,
                        dx: e.deltaX,
                        dy: e.deltaY
                    },
                    evt: e
                }
                this.cursor.snapToCoordinatesSystem(mmv, this.world.getTransformation())
                this.adder.eventProcess(this, mmv);
                //previene l'handling del drag
                return;
            }
        }
        //console.log(e.metaKey)
        let mask = this.getModifiers(e);

        //rotazione globale
        if (this.matchModifiers(mask, Mod.ALT)) {
            this.world.rotate(Math.sign(e.deltaY) * this.rotate_angle);
        }

        //zoom veloce
        if (this.matchModifiers(mask, Mod.CTRL)) {
            let z = 0;
            if (e.deltaY < 0) {
                z = this.zoom_inL;
            } else {
                z = this.zoom_outL;
            }
            let diff = this.world.getTransformation().clone().inv().multiplyPoint(x, y).valueOf();
            this.world.scaleOnPoint(z, z, diff[0], diff[1]);
        }

        //zoom dell'oggetto
        if (this.matchModifiers(mask, Mod.SHIFT)) {
            let z = 0;
            if (Math.sign(e.deltaY) > 0) {
                z = this.zoom_out;
            } else {
                z = this.zoom_in;
            }
            this.element && this.element.scale(z, z)
        }

        if (this.matchModifiers(mask, Mod.META)) {
            world.translate(this.translatel * e.deltaX, this.translatel * e.deltaY)
        }
        //rotazione globale veloce
        if (this.matchModifiers(mask, Mod.ALT, Mod.CTRL)) {
            this.world.rotate(Math.sign(e.deltaY) * this.rotate_angleL);
        }
        //rotazione dell'oggetto
        if (this.matchModifiers(mask, Mod.ALT, Mod.SHIFT)) {
            //el.rotate(rotate_angle * Math.sign(e.deltaY));
            //prendo le coordinate del mouse e le porto nel mondo
            let wp = this.world.getTransformation().clone().inv().multiplyPoint(x, y).valueOf()
            this.element && this.element.rotateOnWorldPoint(Math.sign(e.deltaY) * this.rotate_angle, wp[0], wp[1]);
        }

        if (this.matchModifiers(mask, Mod.ALT, Mod.META)) {

        }

        if (this.matchModifiers(mask, Mod.META, Mod.CTRL)) {
            this.world.translate(this.translatelL * e.deltaX, this.translatelL * e.deltaY)
        }

        if (this.matchModifiers(mask, Mod.META, Mod.CTRL, Mod.ALT)) {

        }

        if (this.matchModifiers(mask, Mod.SHIFT, Mod.META)) {
            this.element && this.element.translate(this.translatel * e.deltaX, this.translatel * e.deltaY);
        }

        if (this.matchModifiers(mask, Mod.SHIFT, Mod.META, Mod.ALT)) {
        }

        if (this.matchModifiers(mask, Mod.SHIFT, Mod.META, Mod.CTRL)) {
            this.element && this.element.translate(this.translatelL * e.deltaX, this.translatelL * e.deltaY);
        }

        if (this.matchModifiers(mask, Mod.SHIFT, Mod.META, Mod.CTRL, Mod.ALT)) {

        }



        //zoom velore dell'oggetto
        if (this.matchModifiers(mask, Mod.CTRL, Mod.SHIFT)) {
            let z = 0;
            if (Math.sign(e.deltaY) > 0) {
                z = this.zoom_outL
            } else {
                z = this.zoom_inL;
            }
            let wp = this.world.getTransformation().clone().inv().multiplyPoint(x, y).valueOf()
            this.element && this.element.scaleOnWorldPoint(z, z, wp[0], wp[1])
        }
        //rotazione veloce dell'oggetto
        if (this.matchModifiers(mask, Mod.ALT, Mod.CTRL, Mod.shiftKey)) {
            let wp = this.world.getTransformation().clone().inv().multiplyPoint(x, y).valueOf()
            this.element && this.element.rotateOnWorldPoint(Math.sign(e.deltaY) * this.rotate_angleL, wp[0], wp[1]);
        }
        //zoom normale
        if (!mask) {
            let z = 0;
            if (e.deltaY < 0) {
                z = this.zoom_in;
            } else {
                z = this.zoom_out;
            }
            let diff = this.world.getTransformation().clone().inv().multiplyPoint(x, y).valueOf()
            this.world.scaleOnPoint(z, z, diff[0], diff[1]);

        }
        this.world.applyTransform(this.context)
        //TODO: serve davvero?
        this.grid.setTransformation(this.gridContext, this.world.getTransformation())
        this.draw();
    };*/
}