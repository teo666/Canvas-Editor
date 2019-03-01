'use strict'

class Size2D extends Element {
    constructor(...args) {
        super();
        if (args.length == 1 && args[0] instanceof Size2D) {
            this.array = args[0].size;
        } else if (args.length == 2 && typeof args[0] == "number" && typeof args[1] == "number") {
            this.array = math.matrix([args[0], args[1]]);
        } else {
            throw "Invalid arguments"
        }

    }

    static atan(...args) {
        if (args.length == 2 && typeof args[0] == 'number' && typeof args[1] == 'number') {
            let a = math.atan2(args[0], args[1])
            if (a < 0) {
                a += math.pi * 2
            }
            return a
        } else if (args.length == 1 && (args[0] instanceof Size2D || args[0] instanceof Point2D)) {
            let a = math.atan2(args[0].y(), args[0].x())
            if (a < 0) {
                a += math.pi * 2
            }
            return a
        }
        throw "Invalid arguments"

    }

    static tan(...args) {
        if (args.length == 2 && typeof args[0] == 'number' && typeof args[1] == 'number') {
            return math.tan(args[0], args[1])
        } else if (args.length == 1 && args[0] instanceof Size2D) {
            return math.tan(args[0].y(), args[0].x())
        }
        throw "Invalid arguments"

    }

    clone() {
        return new Size2D(this)
    }

    x(...args) {
        if (args.length > 0) {
            if (args.length == 1 && typeof args[0] == "number") {
                this.array.valueOf()[0] = args[0]
            } else {
                throw "Invalid arguments"
            }
        }
        return this.toArray[0];
    }

    y(...args) {
        if (args.length > 0) {
            if (args.length == 1 && typeof args[0] == "number") {
                this.array.valueOf()[1] = args[0]
            } else {
                throw "Invalid arguments"
            }
        }
        return this.toArray[1];
    }

    w(...args){
        return this.x(...args)
    }

    h(...args){
        return this.y(...args)
    }

    get toArray() {
        return this.array.valueOf()
    }

    //TODO eliminare getter

    get sizeArray() {
        return this.array.valueOf()
    }
}