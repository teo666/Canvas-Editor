'use strict'

class Size2D {
    constructor(...args) {
        this.c = [0,0]
        if(args.length)this.value(...args)
    }

    value(...args){
        if(!args.length) return this
        
        if (args.length == 1 && args[0] instanceof Size2D) {
            this.w(args[0].w())
            this.h(args[0].h())
        } else if (args.length == 2 && typeof args[0] == "number" && typeof args[1] == "number") {
            this.w(args[0])
            this.h(args[1])
        } else {
            throw "Invalid arguments"
        }
    }

    clone() {
        return new Size2D(this)
    }

    static atan(...args) {
        if (args.length == 2 && typeof args[0] == 'number' && typeof args[1] == 'number') {
            let a = Math.atan2(args[0], args[1])
            if (a < 0) {
                a += Math.pi * 2
            }
            return a
        } else if (args.length == 1 && (args[0] instanceof Size2D || args[0] instanceof Point2D)) {
            let a = Math.atan2(args[0].y(), args[0].x())
            if (a < 0) {
                a += Math.pi * 2
            }
            return a
        }
        throw "Invalid arguments"

    }

    static tan(...args) {
        if (args.length == 2 && typeof args[0] == 'number' && typeof args[1] == 'number') {
            return Math.tan(args[0], args[1])
        } else if (args.length == 1 && args[0] instanceof Size2D) {
            return Math.tan(args[0].y(), args[0].x())
        }
        throw "Invalid arguments"

    }

    x(...args) {
        if (args.length > 0) {
            if (args.length == 1 && typeof args[0] == "number") {
                this.c[0] = args[0]
            } else {
                throw "Invalid arguments"
            }
        }
        return this.c[0];
    }

    y(...args) {
        if (args.length > 0) {
            if (args.length == 1 && typeof args[0] == "number") {
                this.c[1] = args[0]
            } else {
                throw "Invalid arguments"
            }
        }
        return this.c[1];
    }

    w(...args){
        return this.x(...args)
    }

    h(...args){
        return this.y(...args)
    }
}