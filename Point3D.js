'use strict'

class Point3D extends Element{
    constructor(x, y, z){
        super();
        this.array3 = math.matrix([x, y, z]);
        this.array4 = math.matrix([x, y, z, 1]);
    }

    get point3(){
        return math.clone(this.array3);
    }

    get point4(){
        return math.clone(this.array4);
    }

    get toArray3(){
        return this.array3.valueOf()
    }

    get toArray4(){
        return this.array4.valueOf()
    }

    get x(){
        return this.toArray3[0];
    }

    get y(){
        return this.toArray3[1];
    }

    get z(){
        return this.toArray3[2];
    }

    hitTest(x,y,tr){
        return false;
    }

}