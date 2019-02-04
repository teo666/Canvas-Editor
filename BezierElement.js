'using strict'

class BezierElement extends Element{

    constructor(){
        super()
        let handle1 = new Ellipse(10,10);
        let handle2 = new Ellipse(10,10);
        let handle3 = new Ellipse(10,10);
        let handle4 = new Ellipse(10,10);

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

}