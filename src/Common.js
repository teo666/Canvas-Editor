'use strict'

class Common{
    constructor(){
        this.transformation = math.identity(3, 3);
        this.elements = [];
        this.scale_factor = {
            x: 1,
            y: 1
        }
    }

    get getScaleFactor() {
        return {
            x: this.scale_factor.x,
            y: this.scale_factor.y
        }
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
        let tm = math.matrix([[w, 0, 0], [0, h, 0], [0, 0, 1]]);
        this.transformation = math.multiply(this.transformation, tm);
        return tm;
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
        let tm = math.matrix([[1.0, 0, x], [0, 1.0, y], [0, 0, 1.0]]);
        this.transformation = math.multiply(this.transformation, tm);
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
        let tm = math.matrix([[0, 0, x], [0, 0, y], [0, 0, 0]]);
        this.transformation = math.add(this.transformation, tm);
    }

    rotate(teta) {
        if (typeof teta != "number") {
            throw "Invalid arguments"
        }
        let cos = math.cos(teta);
        let sin = math.sin(teta);
        let tm = math.matrix([[cos, sin, 0], [-sin, cos, 0], [0, 0, 1]]);
        this.transformation = math.multiply(this.transformation, tm);
        return tm;
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
            w  = args[0];
            h  = args[1];
            cx = args[2];
            cy = args[3];
        } else if( args.length == 0 && args[0] instanceof Array){
            w  = args[0][0];
            h  = args[0][1];
            cx = args[0][2];
            cy = args[0][3];
        } else {
            throw "invalid arguments"
        }
        let c = math.multiply(math.inv(this.scale(w, h)), [cx, cy, 1]);
        let t = math.subtract(c, [cx, cy, 0]).valueOf();
        this.translate(t[0], t[1]);
    }

    get getTransformation() {
        return math.clone(this.transformation);
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