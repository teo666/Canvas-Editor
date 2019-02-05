'using strict'

class BezierElement extends Element{

    constructor(){
        super()
        this.selected = null;
        let handle1 = new Ellipse(5,5);
        let handle2 = new Ellipse(5,5);
        let handle3 = new Ellipse(5,5);
        let handle4 = new Ellipse(5,5);

        let line1 = new Line(10,10,10,110);
        let line2 = new Line(110,10,110,110);

        const bezier_verices = {
            start: [10, 10],
            points: [
                [10, 110, 110, 110, 110, 10]
            ]
        }

        let bez = new Bezier(bezier_verices);
        
        this.addElement(bez)

        handle1.translate(10,10);
        handle2.translate(110,10);
        handle3.translate(110,110);
        handle4.translate(10,110);

        this.addElement(handle1)
        this.addElement(handle2)
        this.addElement(handle3)
        this.addElement(handle4)

        this.addElement(line1)
        this.addElement(line2)

        bez.buildPath = function(){
            //console.log("asdasd")
            this.path = new Path2D();
            this.path.moveTo.apply(this.path, this.vertices.start)

            this.vertices.points.forEach((e, i) => {
                this.path.bezierCurveTo.apply(this.path, e);
            });
        }

        bez.draw = function(parentT){
            ctx.save();

            let ts = math.multiply(parentT, this.transformation);
    
            ctx.setTransform(
                math.subset(ts, math.index(0, 0)),
                math.subset(ts, math.index(1, 0)),
                math.subset(ts, math.index(0, 1)),
                math.subset(ts, math.index(1, 1)),
                math.subset(ts, math.index(0, 2)),
                math.subset(ts, math.index(1, 2))
            )
            ctx.lineWidth = "3"
            ctx.stroke(this.path)
            ctx.restore();
        }

        bez.buildPath.apply(bez);

    }

    hitTest(){
        return false
    }

    draw(parentT){
        
        ctx.save();

        let ts = math.multiply(parentT, this.transformation);

        ctx.setTransform(
            math.subset(ts, math.index(0, 0)),
            math.subset(ts, math.index(1, 0)),
            math.subset(ts, math.index(0, 1)),
            math.subset(ts, math.index(1, 1)),
            math.subset(ts, math.index(0, 2)),
            math.subset(ts, math.index(1, 2))
        )
        //non disegno nulla per ora
        ctx.restore();

        super.draw(ts)

    }

    //////////////////////////////////// event handling //////////////////////////////////


    mousedown(e){
        this.selected = null;
        //console.log("bezier editor handling mouse down")
        let rvt = Object.assign(e, {parentTransformation : math.multiply( e.parentTransformation, this.getTransformation )})
        console.log(rvt)
        this.elements.forEach(el => {
            if(el instanceof Ellipse && el.hitTest(rvt.x, rvt.y, rvt.parentTransformation )){
                this.selected = el;
                this.selection_point = {
                    x : rvt.x,
                    y : rvt.y
                }
                return false;
            }
        });
        console.log(this.selected)
        return false
    }

    mousemove(e){
        let rvt = Object.assign(e, {parentTransformation : math.multiply( e.parentTransformation, this.getTransformation )})
        if(this.selected){
            this.selected.translate(rvt.x - this.selection_point.x , rvt.y - this.selection_point.y )
            
            this.selection_point.x = rvt.x;
            this.selection_point.y = rvt.y;

            draw();    
        }
        //stop propagation
        return false;
    }

    mouseup(e){
        if(this.selected){
            this.selected = null;
        }
        return false;
    }

}