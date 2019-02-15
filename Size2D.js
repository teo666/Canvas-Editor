'use strict'

class Size2D extends Element{
    constructor(...args){
        super();
        if(args.length == 1 && args[0] instanceof Size2D){
            this.array = args[0].size;
        } else if (args.length == 2 && typeof args[0] == "number" && typeof args[1] == "number"){
            this.array = math.matrix([ args[0], args[1] ]);
        } else{
            throw "Invalid arguments"
        }
        
    }

    clone(){
        return new Size2D(this)
    }

    get size(){
        return math.clone(this.array);
    }

    get sizeArray(){
        return this.array.valueOf()
    }

    get x(){
        return this.sizeArray[0];
    }

    get y(){
        return this.sizeArray[1];
    }

    get w(){
        return this.x;
    }

    get h(){
        return this.y;
    }
}