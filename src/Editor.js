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

        this.world = new World();
        this.adder = new Adder();
        this.cursor = new Cursor();
        this.cursor.snap(2.54)
        this.colors = new Colors();
        this.canvasStyle = new CanvasStyle();

        if (obj.gridCanvas && obj.gridCanvas.nodeName && obj.gridCanvas.nodeName == 'CANVAS') {
            this.grid = new Grid();
            this.grid.setCanvas(obj.gridCanvas)
            this.grid.snap(2.54)
        }

        this.CTRL = 0b0001;
        this.ALT = 0b0010;
        this.SHIFT = 0b0100;
        this.META = 0b1000

        this.zoom_in = 1.05;
        this.zoom_out = 1 / 1.05;
        this.zoom_inL = 1.15;
        this.zoom_outL = 1 / 1.15;
        this.rotate_angle = math.pi / 500;
        this.rotate_angleL = math.pi / 50;
        this.translatel = 1;
        this.translatelL = 5;

        this.drag = false;
        this.drag_point = null;
        this.is_dragging = false;

        this.element = null;

        this.addEvents()
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
        this.context.lineWidth = 1 / this.world.getScaleFactor.x;
        this.context.beginPath();
        this.context.moveTo(-1000000, 0);
        this.context.lineTo(1000000, 0);
        this.context.lineWidth = 1 / this.world.getScaleFactor.y;
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
    }

    get_mask(e) {
        let m = 0b0000;
        if (e.ctrlKey) {
            m |= this.CTRL;
        }
        if (e.altKey) {
            m |= this.ALT;
        }
        if (e.shiftKey) {
            m |= this.SHIFT;
        }
        if (e.metaKey) {
            m |= this.META;
        }
        //console.log(m)
        return m;
    }

    addEvents() {
        this.addMouseMove();
        this.addMouseDown();
        this.addMouseLeave()
        this.addMouseUp()
        this.addMouseWheel()
        this.addKeyUp()
    }

    addMouseMove() {
        let self = this;
        this.canvas.addEventListener("mousemove", function () {
            self.mouseMoveCallback.apply(self, arguments)
        });
    }

    addMouseDown() {
        let self = this;
        this.canvas.addEventListener("mousedown", function () {
            self.mouseDownCallback.apply(self, arguments)
        });
    }

    addMouseUp() {
        let self = this;
        this.canvas.addEventListener("mouseup", function () {
            self.mouseUpCallback.apply(self, arguments)
        });
    }

    addMouseLeave() {
        let self = this;
        this.canvas.addEventListener("mouseleave", function () {
            self.mouseLeaveCallback.apply(self, arguments)
        });
    }

    addMouseWheel() {
        let self = this;
        this.canvas.addEventListener("wheel", function () {
            self.mouseWheelCallback.apply(self, arguments)
        });
    }

    addKeyUp() {
        let self = this;
        document.body.addEventListener("keyup", function () {
            self.keyUpCallback.apply(self, arguments)
        });
    }

    keyUpCallback(e) {
        //console.log(e);
        switch (e.key) {
            case "Escape":
                if (this.adder.isAdding()) {
                    this.adder.cancel();
                    this.draw()
                }
                break;
            default:
                break;
        }
    }

    mouseMoveCallback(e) {
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
            this.cursor.snapToWorldCoordinates(mmv, this.world.getTransformation)
            this.adder.eventProcess(mmv);
        } else {

            e.preventDefault();
            let event = {
                x: x,
                y: y,
                parentTransformation: math.identity(3)
            }
            this.world.mousemove(event);
        }
    }

    mouseDownCallback(e) {
        e.preventDefault()
        let rect = e.target.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        this.drag = true;
        this.drag_point = {
            x: x,
            y: y
        }
    }

    mouseUpCallback(e) {
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
                this.cursor.snapToWorldCoordinates(mmv, this.world.getTransformation)
                this.adder.eventProcess(mmv);
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

    mouseLeaveCallback() {
        this.drag = false;
        this.is_dragging = false;
    };

    mouseWheelCallback(e) {
        let rect = e.target.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        e.preventDefault();

        if (this.adder.isAdding()) {
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
            this.cursor.snapToWorldCoordinates(mmv, this.world.getTransformation)
            this.adder.eventProcess(mmv);
            return;
        }
        //console.log(e.metaKey)
        let mask = this.get_mask(e);

        //rotazione globale
        if (!(mask ^ this.ALT)) {
            this.world.rotate(math.sign(e.deltaY) * this.rotate_angle);
        }

        //zoom veloce
        if (!(mask ^ this.CTRL)) {
            let z = 0;
            if (e.deltaY < 0) {
                z = zoom_inL;
            } else {
                z = zoom_outL;
            }
            let diff = math.multiply(math.inv(this.world.getTransformation), [x, y, 1]);
            this.world.scaleOnPoint(z, z, math.subset(diff, math.index(0)), math.subset(diff, math.index(1)));
        }

        //zoom dell'oggetto
        if (!(mask ^ this.SHIFT)) {
            let z = 0;
            if (math.sign(e.deltaY) > 0) {
                z = this.zoom_out;
            } else {
                z = this.zoom_in;
            }
            this.element && this.element.scale(z, z)
        }

        if (!(mask ^ this.META)) {
            world.translate(this.translatel * e.deltaX, this.translatel * e.deltaY)
        }
        //rotazione globale veloce
        if (!(mask ^ (this.ALT | this.CTRL))) {
            this.world.rotate(math.sign(e.deltaY) * this.rotate_angleL);
        }
        //rotazione dell'oggetto
        if (!(mask ^ (this.ALT | this.SHIFT))) {
            //el.rotate(rotate_angle * math.sign(e.deltaY));
            //prendo le coordinate del mouse e le porto nel mondo
            let wp = math.multiply(math.inv(this.world.getTransformation), math.matrix([x, y, 1]))
            this.element && this.element.rotateOnWorldPoint(math.sign(e.deltaY) * this.rotate_angle, math.subset(wp, math.index(0)), math.subset(wp, math.index(1)));
        }

        if (!(mask ^ (this.ALT | this.META))) {

        }

        if (!(mask ^ (this.META | this.CTRL))) {
            this.world.translate(this.translatelL * e.deltaX, this.translatelL * e.deltaY)
        }

        if (!(mask ^ (this.META | this.CTRL | this.ALT))) {

        }

        if (!(mask ^ (this.SHIFT | this.META))) {
            this.element && this.element.translate(this.translatel * e.deltaX, this.translatel * e.deltaY);
        }

        if (!(mask ^ (this.SHIFT | this.META | this.ALT))) {
        }

        if (!(mask ^ (this.SHIFT | this.META | this.CTRL))) {
            this.element && this.element.translate(this.translatelL * e.deltaX, this.translatelL * e.deltaY);
        }

        if (!(mask ^ (this.SHIFT | this.META | this.CTRL | this.ALT))) {

        }



        //zoom velore dell'oggetto
        if (!(mask ^ (this.CTRL | this.SHIFT))) {
            let z = 0;
            if (math.sign(e.deltaY) > 0) {
                z = this.zoom_outL
            } else {
                z = this.zoom_inL;
            }
            let wp = math.multiply(math.inv(this.world.getTransformation), math.matrix([x, y, 1]))
            this.element && this.element.scaleOnWorldPoint(z, z, math.subset(wp, math.index(0)), math.subset(wp, math.index(1)))
        }
        //rotazione veloce dell'oggetto
        if (!(mask ^ (this.ALT | this.CTRL | this.SHIFT))) {
            let wp = math.multiply(math.inv(this.world.getTransformation), math.matrix([x, y, 1]))
            this.element && this.element.rotateOnWorldPoint(math.sign(e.deltaY) * this.rotate_angleL, math.subset(wp, math.index(0)), math.subset(wp, math.index(1)));
        }
        //zoom normale
        if (!mask) {
            let z = 0;
            if (e.deltaY < 0) {
                z = this.zoom_in;
            } else {
                z = this.zoom_out;
            }
            let diff = math.multiply(math.inv(this.world.getTransformation), [x, y, 1]);
            this.world.scaleOnPoint(z, z, math.subset(diff, math.index(0)), math.subset(diff, math.index(1)));

        }
        this.world.applyTransform(this.context)
        this.draw();
    };
}