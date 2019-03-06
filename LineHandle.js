'use strict'

class LineHandle extends Element {
    constructor(...args) {
        super();
        if (args.length == 1 && args[0] instanceof LineHandle) {
            throw "TODO:"
        } else if (args.length == 4 &&
            args[0] instanceof Point2D &&
            args[1] instanceof Size2D &&
            args[2] instanceof Point2D &&
            args[3] instanceof Size2D) {

            this.line = new Line(args[0], args[2])
            this.startHandle = new Ellipse( args[0], args[1] )
            this.endHandle = new Ellipse( args[2], args[3] )

            this.addElement(this.line);
            this.addElement(this.startHandle)
            this.addElement(this.endHandle)
        } else {
            throw "Invalid arguments"
        }

    }

    get getStartSHALLOW(){
        return this.startHandle.getCenterSHALLOW
    }

    get getEndSHALLOW(){
        return this.endHandle.getCenterSHALLOW
    }

    clone() {
        return new LineHandle(this)
    }

    draw(parentT){
        super.draw(parentT)

    }

    //////////////////////////////////// event handling //////////////////////////////////


    mousedown(e){
        this.selected = null;
        //console.log("lh")
        //console.log("bezier editor handling mouse down")
        let rvt = Object.assign(e, {parentTransformation : math.multiply( e.parentTransformation, this.getTransformation )})
        return this.elements.some(el => {
            if(el instanceof Ellipse && el.hitTest(rvt.x, rvt.y, rvt.parentTransformation )){
                this.selected = el;
                this.selection_point = {
                    x : rvt.x,
                    y : rvt.y
                }
                //stop propagation
                return true;
            }
        });
    }

    mousemove(e){
        let rvt = Object.assign(e, {parentTransformation : math.multiply( e.parentTransformation, this.getTransformation )})
        if(this.selected){
            this.selected.translate(rvt.x - this.selection_point.x , rvt.y - this.selection_point.y )
            
            if(this.selected === this.startHandle){
                this.line.setStart( this.selected.transformedCenter().valueOf() );
            } else if(this.selected === this.endHandle){
                this.line.setEnd( this.selected.transformedCenter().valueOf() )
            }
            
            this.selection_point.x = rvt.x;
            this.selection_point.y = rvt.y;
            
            //stop propagation
            return true;
        }
        //continue propagation  
        return false
    }

    mouseup(e){
        if(this.selected){
            this.selected = null;
        }
        return true;
    }
}