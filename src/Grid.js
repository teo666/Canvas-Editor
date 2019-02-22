'use strict'

class Grid {
    constructor() {
        this.snapSize = 0;
        this.context = null;
        this.transformation = null;
    }

    snap(s) {
        if (s && typeof s == 'number') {
            this.snapSize = math.abs(s);
        }
        return this.snapSize
    }

    buildGrid() {
        //TODOgit 
    }

    setCanvas(c){
        if ( !c || !c.nodeName || c.nodeName != 'CANVAS') {
            throw "Not a valid canvas"
        }
        this.canvas = c;
        this.context = this.canvas.getContext("2d");
    }

    setTransformation(...args) {
        if (this.context) {
            if (args.length == 1 && args[0] instanceof math.Matrix) {
                this.transformation = math.clone(args[0])
                let ts = args[0].valueOf()
                this.context.setTransform(
                    ts[0][0],
                    ts[1][0],
                    ts[0][1],
                    ts[1][1],
                    ts[0][2],
                    ts[1][2]
                )
            } else if (args.length == 6 &&
                typeof args[0] == 'number' &&
                typeof args[1] == 'number' &&
                typeof args[2] == 'number' &&
                typeof args[3] == 'number' &&
                typeof args[4] == 'number' &&
                typeof args[5] == 'number') {
                this.transformation = math.matrix(
                    [args[0], args[2], args[4]],
                    [args[1], args[3], args[5]],
                    [0, 0, 1]
                )
                this.context.setTransform(
                    args[0],
                    args[1],
                    args[2],
                    args[3],
                    args[4],
                    args[5]
                )
            }
        }
    }
}