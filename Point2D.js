'use strict'

class Point2D extends Element{
    constructor(...args){
        super();
        this.value(...args)
    }

    clone(){
        return new Point2D(this)
    }

    value(...args){
        if(args.length == 1 && args[0] instanceof Point2D){
            this.array2 = args[0].point2;
            this.array3 = args[0].point3
        } else if (args.length == 2 && typeof args[0] == "number" && typeof args[1] == "number"){
            this.array2 = math.matrix( [ args[0], args[1] ]);
            this.array3 = math.matrix([args[0], args[1], 1]);
        } else if(args.length == 1 && args[0] instanceof Array && args[0].length > 2){
            this.array2 = math.matrix( [ args[0][0], args[0][1] ])
            this.array3 = math.matrix( [ args[0][0], args[0][1] , 1]);
        } else{
            throw "Invalid arguments"
        }
    }

    get point2(){
        return math.clone(this.array2);
    }

    get point3(){
        return math.clone(this.array3);
    }

    get toArray2(){
        return this.array2.valueOf()
    }

    get toArray3(){
        return this.array3.valueOf()
    }

    x(...args){
        if(args.length == 1 && typeof args[0] == "number"){
            this.array2.valueOf()[0] = args[0]
            this.array3.valueOf()[0] = args[0]
        } else {
            return this.toArray2[0];
        }
    }

    y(...args){
        if(args.length == 1 && typeof args[0] == "number"){
            this.array2.valueOf()[1] = args[0]
            this.array3.valueOf()[1] = args[0]
        } else{
            return this.toArray2[1];
        }
    }
    w(...args){
        return this.x(...args);
    }

    h(...args){
        return this.y(...args);
    }

    hitTest(x,y,tr){
        return false;
    }

}