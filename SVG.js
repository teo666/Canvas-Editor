'use strict'

class SVG extends Element {
    constructor(args) {
        super();
        this.definition = JSON.parse(JSON.stringify(args));
        this.buildPath();
    }

    buildPath(){

        let m = new DOMMatrix()

        m.a = math.subset(this.transformation, math.index(0,0));
        m.b = math.subset(this.transformation, math.index(1,0));
        m.c = math.subset(this.transformation, math.index(0,1));
        m.d = math.subset(this.transformation, math.index(1,1));
        m.e = math.subset(this.transformation, math.index(0,2));
        m.f = math.subset(this.transformation, math.index(1,2));

        this.definition.forEach(e => {
            e.shape = new Path2D()
            e.path.forEach( f =>{
                //console.log(f)
                e.shape.addPath(new Path2D(f),m);
            })
        });
        /*delete this.path
        this.path = new Path2D()

        this.definition.forEach(e => {
            this.path.addPath(e.shape)  
        });*/
              
    }

    hitTest(x, y, tr) {

        let t = math.multiply(math.inv(tr), [x, y, 1]);
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        //ctx.stroke(this.path)
        let tx = math.subset(t, math.index(0))
        let ty = math.subset(t, math.index(1))
        let ret = false;
        this.definition.forEach(e =>{
            ret = ret || ctx.isPointInPath(e.shape, tx, ty);
            if(ret){
                return;
            }
        });
        ctx.restore();
        return ret;
    }

    draw(parentT) {
        this.buildPath()
        ctx.save();
        this.definition.forEach( (e) =>{

            ctx.fillStyle = e.fill;
            ctx.strokeStyle = e.stroke;
            ctx.fill(e.shape)
            ctx.stroke(e.shape)
        })
        ctx.restore()
    }

}