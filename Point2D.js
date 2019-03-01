'use strict'

class Point2D extends Element {
    constructor(...args) {
        super();
        this.value(...args)
    }

    clone() {
        return new Point2D(this)
    }

    value(...args) {
        if (args.length == 1 && args[0] instanceof Point2D) {
            this.array2 = args[0].point2;
            this.array3 = args[0].point3
        } else if (args.length == 2 && typeof args[0] == "number" && typeof args[1] == "number") {
            this.array2 = math.matrix([args[0], args[1]]);
            this.array3 = math.matrix([args[0], args[1], 1]);
        } else if (args.length == 1 && args[0] instanceof Array && args[0].length > 2) {
            this.array2 = math.matrix([args[0][0], args[0][1]])
            this.array3 = math.matrix([args[0][0], args[0][1], 1]);
        } else {
            throw "Invalid arguments"
        }
    }

    toSize2D() {
        return new Size2D(this.x(), this.y())
    }

    equal(...args) {
        if (args.length == 1 && args[0] instanceof Point2D) {
            return (this.x() == args[0].x() && this.y() == args[0].y())
        } else {
            return false
        }
    }

    static equal(...args) {
        if (args.length == 2 && args[0] instanceof Point2D && args[1] instanceof Point2D) {
            return (args[0].x() == args[1].x() && args[0].y() == args[1].y())
        } else {
            return false
        }
    }

    abs() {
        this.x(Math.abs(this.x()))
        this.y(Math.abs(this.y()))
        return this
    }

    subtract(...args) {
        if (args.length > 0) {
            if (args.length == 1 && args[0] instanceof Point2D) {
                ret.x(ret.x() - args[0].x())
                ret.y(ret.y() - args[0].y())
            } else if (args.length == 1 && typeof args[0] == 'number' && typeof args[1] == 'number') {
                ret.x(ret.x() - args[0])
                ret.y(ret.y() - args[1])
            }
        }
        return this;
    }

    static subtract(...args) {
        let ret = new Point2D(0, 0)
        if (args.length > 0) {
            if (args.some((element, index) => {
                if (!element instanceof Point2D) {
                    return true
                }
                if (index) {
                    ret.x(ret.x() - element.x())
                    ret.y(ret.y() - element.y())
                } else {
                    ret.x(element.x())
                    ret.y(element.y())
                }
            })) {
                throw "Invalid arguments"
            }
        }
        return ret
    }

    static hypot(...args) {
        if (args.length == 2 && args[0] instanceof Point2D && args[1] instanceof Point2D) {
            let diff = Point2D.subtract(args[0], args[1])
            return math.hypot(diff.x(), diff.y())
        }
        throw "Invalid arguments"
    }

    static angle(...args) {
        if (args.length == 2 && args[0] instanceof Point2D && args[1] instanceof Point2D) {
            let alfa = Size2D.atan(Point2D.subtract(args[1], args[0]))
            if (alfa < 0) {
                alfa += math.pi * 2
            }
            return alfa
        }
        throw "Invalid arguments"
    }

    static isUp(...args) {
        if (args.length == 3 && args[0] instanceof Point2D && args[1] instanceof Point2D && args[2] instanceof Point2D) {
            let line_angle = Size2D.atan(Point2D.subtract(args[1], args[0]))
            if (line_angle < 0) {
                line_angle += math.pi * 2
            }
            let ldiff = Point2D.subtract(args[2], args[0])
            let line_angle_t = Size2D.atan(ldiff)
            if (line_angle_t < 0) {
                line_angle_t += math.pi * 2
            }

            if (line_angle_t < line_angle) {
                line_angle_t += math.pi * 2
            }

            let ss = line_angle_t - line_angle
            let ret = 0
            if (args[0].x() < args[1].x()) {
                if (ss < math.pi) {
                    ret = 1
                }
            } else {
                if (ss > math.pi) {
                    ret = 1
                }
            }
            let d = math.sin(ss) * math.hypot(ldiff.x(), ldiff.y())
            let reto = {
                up: ret,
                distance: d,
                dx: (-math.sin(line_angle)),
                dy: math.cos(line_angle)
            }
            return reto
        }
        throw "Invalid arguments"
    }

    get point2() {
        return math.clone(this.array2);
    }

    get point3() {
        return math.clone(this.array3);
    }

    get toArray2() {
        return this.array2.valueOf()
    }

    get toArray3() {
        return this.array3.valueOf()
    }

    x(...args) {
        if (args.length == 1 && typeof args[0] == "number") {
            this.array2.valueOf()[0] = args[0]
            this.array3.valueOf()[0] = args[0]
        } else {
            return this.toArray2[0];
        }
    }

    y(...args) {
        if (args.length == 1 && typeof args[0] == "number") {
            this.array2.valueOf()[1] = args[0]
            this.array3.valueOf()[1] = args[0]
        } else {
            return this.toArray2[1];
        }
    }
    w(...args) {
        return this.x(...args);
    }

    h(...args) {
        return this.y(...args);
    }

    hitTest(x, y, tr) {
        return false;
    }

}