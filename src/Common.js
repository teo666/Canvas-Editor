'use strict'

class Common {
    constructor() {
        this.transformation = new TransformationMatrix();
        this.elements = [];
        this.scale_factor = {
            x: 1,
            y: 1
        }
    }

    getScaleFactor() {
        return {
            x: this.transformation.scaleFactor.x,
            y: this.transformation.scaleFactor.y
        }
    }

    getElements() {
        return this.elements
    }

    scale(...args) {
        let w, h;
        if (args.length == 1) {
            if (args[0] instanceof Point2D || args[0] instanceof Size2D) {
                //both point2d and size2d have x and y
                w = args[0].w;
                h = args[0].h;
            } else if (args[0] instanceof Array && args[0].length > 1) {
                w = args[0][0];
                h = args[0][1];
            }
        } else if (args.length == 2 && typeof args[0] == "number" && typeof args[1] == "number") {
            w = args[0];
            h = args[1];
        } else {
            throw "invalid arguments"
        }
        this.scale_factor.x *= w;
        this.scale_factor.y *= h;
        return this.transformation.scale(w, h)
    }

    translate(...args) {
        let x, y;
        if (args.length == 1) {
            if (args[0] instanceof Point2D || args[0] instanceof Size2D) {
                //both point2d and size2d have x and y
                x = args[0].x;
                y = args[0].y;
            } else if (args[0] instanceof Array && args[0].length > 1) {
                x = args[0][0];
                y = args[0][1];
            }
        } else if (args.length == 2 && typeof args[0] == "number" && typeof args[1] == "number") {
            x = args[0];
            y = args[1];
        } else {
            throw "invalid arguments"
        }
        return this.transformation.translate(x, y)
    }

    translateAdd(...args) {
        let x, y;
        if (args.length == 1) {
            if (args[0] instanceof Point2D || args[0] instanceof Size2D) {
                //both point2d and size2d have x and y
                x = args[0].x;
                y = args[0].y;
            } else if (args[0] instanceof Array && args[0].length > 1) {
                x = args[0][0];
                y = args[0][1];
            }
        } else if (args.length == 2 && typeof args[0] == "number" && typeof args[1] == "number") {
            x = args[0];
            y = args[1];
        } else {
            throw "invalid arguments"
        }
        return this.transformation.translateAdd(x, y)
    }

    rotate(teta) {
        if (typeof teta != "number") {
            throw "Invalid arguments"
        }
        return this.transformation.rotate(teta)
    }

    scaleOnPoint(...args) {
        let w, h, cx, cy;
        if (args.length == 2) {
            if ((args[0] instanceof Point2D || args[0] instanceof Size2D) &&
                (args[1] instanceof Point2D || args[1] instanceof Size2D)) {
                w = args[0].w
                h = args[0].h
                cx = args[1].x
                cy = args[1].y
            }
        } else if (args.length == 4 &&
            typeof args[0] == "number" &&
            typeof args[1] == "number" &&
            typeof args[2] == "number" &&
            typeof args[3] == "number") {
            w = args[0];
            h = args[1];
            cx = args[2];
            cy = args[3];
        } else if (args.length == 0 && args[0] instanceof Array) {
            w = args[0][0];
            h = args[0][1];
            cx = args[0][2];
            cy = args[0][3];
        } else {
            throw "invalid arguments"
        }
        return this.transformation.scaleOnPoint(w, h, cx, cy)
    }

    getTransformation() {
        return this.transformation;
    }

    addElement(el) {
        if (el instanceof Element) {
            if (!el.parent) {
                el.parent = this;
            }
            this.elements.push(el);
        } else {
            throw "Try to add non Element instance"
        }
    }
}