'use strict'

class Editor {

    constructor(obj) {
        if (!obj) {
            throw "Invalid arguments"
        }
        if (!obj.dataCanvas) {
            throw "Canvas has not been specify"
        }

        if (obj.dataCanvas.nodeName != 'CANVAS') {
            throw "Not a valid canvas"
        }
        this.canvasContainer = obj.canvasContainer
        this.dataCanvas = obj.dataCanvas;
        this.contextes = {
            bg: null,
            data: this.dataCanvas.getContext('2d'),
            fg: null
        }

        this.tool = new Tool();
        this.world = new World();
        this.cursor = new Cursor();

        this.cursor.snap(50)

        if (obj.backgroundCanvas && obj.backgroundCanvas.nodeName && obj.backgroundCanvas.nodeName == 'CANVAS') {
            this.grid = new Grid();
            this.backgroundCanvas = obj.backgroundCanvas
            this.contextes.bg = this.backgroundCanvas.getContext("2d");
            this.grid.snap(50)
            this.grid.prefetch(this.backgroundContext, this.backgroundCanvas, this.world)
        }

        if (obj.foregroundCanvas && obj.foregroundCanvas.nodeName && obj.foregroundCanvas.nodeName == 'CANVAS') {
            this.foregroundCanvas = obj.foregroundCanvas
            this.contextes.fg = this.foregroundCanvas.getContext("2d");
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

        if (obj && obj.properties) {
            this.toolrenderer = new ToolsRenderer(obj.properties)
            this.toolrenderer.prefetch()
            this.tool.tools.pointer.eventTarget(obj.properties)
        }


        //TODO: TOGLIERE
        this.world.translate(200, 200)
        this.world.applyTransform(this.contextes)

        let l = new Line()
        l.translate(150, 50)
        //l.rotate(-Math.PI/4)
        l.start(0, 0)
        l.end(500, 0)
        l.width(50)
        this.world.addElement(l)
        let el = new Ellipse()
        el.center(50, 50)
        el.radius(50, 90)
        el.translate(100, 300)
        this.world.addElement(el)

        let qd = new Rectangle()
        qd.corner(10, 10)
        qd.size(100, 200)
        this.world.addElement(qd)
        ////////////


        this.draw()
        this.drawForeground()
    }

    draw_point(x, y, r) {
        this.contextes.bg.beginPath();
        this.contextes.bg.arc(x, y, r, 0, 2 * Math.PI, false);
        this.contextes.bg.fillStyle = 'blue';
        this.contextes.bg.fill();
        this.contextes.bg.strokeStyle = '#003300';
        this.contextes.bg.stroke();
    };

    draw_center() {
        this.draw_point(0, 0, 30);
    };


    draw_axis() {
        this.contextes.bg.save()
        this.grid.setTransformation(this.contextes.bg, this.world.getTransformation())
        this.contextes.bg.lineWidth = 1 / this.world.getScaleFactor().x;
        this.contextes.bg.beginPath();
        this.contextes.bg.moveTo(-1000000, 0);
        this.contextes.bg.lineTo(1000000, 0);
        this.contextes.bg.lineWidth = 1 / this.world.getScaleFactor().y;
        this.contextes.bg.moveTo(0, -1000000);
        this.contextes.bg.lineTo(0, 1000000);
        this.contextes.bg.strokeStyle = 'grey'
        this.contextes.bg.stroke();
        this.contextes.bg.restore()
    };

    clearData() {
        this.contextes.data.save();
        this.contextes.data.setTransform(1, 0, 0, 1, 0, 0);
        this.contextes.data.clearRect(0, 0, this.dataCanvas.width, this.dataCanvas.height);
        this.contextes.data.restore();
    }

    clearForground() {
        debugger
        this.contextes.fg.save();
        this.contextes.fg.setTransform(1, 0, 0, 1, 0, 0);
        this.contextes.fg.clearRect(0, 0, this.dataCanvas.width, this.dataCanvas.height);
        this.contextes.fg.restore();
    }

    /** la chiamata a questo puo' essere tranquillamente sempre evitata salvo casi particolari
    * per esempio quando il colore di sfondo del grid e' trasparente 
    */
    clearBackground() {
        this.contextes.bg.save();
        this.contextes.bg.setTransform(1, 0, 0, 1, 0, 0);
        this.contextes.bg.clearRect(0, 0, this.dataCanvas.width, this.dataCanvas.height);
        this.contextes.bg.restore();
    }

    clearAll() {
        this.clearBackground()
        this.clearData()
        this.clearForground()
    }

    drawForeground(){
        this.clearForground()
        this.world.drawPivot(this.contextes)
        this.world.addHitRegions(this.contextes)
    }

    draw() {
        this.clearData();
        this.grid.draw(this.contextes, this.backgroundCanvas, this.world)
        this.world.draw(this.contextes);
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
        this.foregroundCanvas.addEventListener("mousemove", function () {
            self.tool.dispatch(self, EventUtil.EvtType.mousemove, ...arguments)
        });
    }

    addMouseDown() {
        let self = this;
        this.foregroundCanvas.addEventListener("mousedown", function () {
            self.tool.dispatch(self, EventUtil.EvtType.mousedown, ...arguments)
        });
    }

    addMouseUp() {
        let self = this;
        this.foregroundCanvas.addEventListener("mouseup", function () {
            self.tool.dispatch(self, EventUtil.EvtType.mouseup, ...arguments)
        });
    }

    addMouseLeave() {
        let self = this;
        this.foregroundCanvas.addEventListener("mouseleave", function () {
            self.tool.dispatch(self, EventUtil.EvtType.mouseleave, ...arguments)
        });
    }

    addMouseWheel() {
        let self = this;
        this.foregroundCanvas.addEventListener("wheel", function () {
            self.tool.dispatch(self, EventUtil.EvtType.mousewheel, ...arguments)
        });
    }

    addMouseDoubleClick() {
        let self = this;
        this.foregroundCanvas.addEventListener("dblclick", function () {
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
            this.grid.setTransformation(this.backgroundContext, this.world.getTransformation());
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
        this.draw();
    };*/
}
