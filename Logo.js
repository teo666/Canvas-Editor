'use strict'

class Logo extends Element{
    constructor(s){
        super();
        this.radius = 325;
    }

    setSource(s){
        return new Promise((resolve, reject) => {
            this.img = new Image();
            this.img.addEventListener('load', e => resolve(this.img));
            this.img.addEventListener('error', () => {
                reject(new Error(`Failed to load image's URL: ${s}`));
            });
            this.img.src = s;
        })
    }

    getImageDimension(){
        return {
            w : this.img.width,
            h : this.img.height
        }
    }

    hitTest(x,y,tr){
        //x and y are coordinates relative to canvas including world transformations
        //
        let t = math.multiply(tr ,this.getTransformation() )
        let p = math.multiply(math.inv(t), [x,y,1])
        let radius = this.img.width/2
        p = math.subtract(p, [radius, radius,1])

        //console.log(math.multiply(p,p))
        if(math.multiply(p,p) < (radius*radius) ){
            return true;
        }
        return false;
    }

    draw(world){
        ctx.save();
    
        let ts = math.multiply(world, this.transformation);
        
        ctx.setTransform(
            math.subset(ts,math.index(0,0)),
            math.subset(ts,math.index(1,0)),
            math.subset(ts,math.index(0,1)),
            math.subset(ts,math.index(1,1)),
            math.subset(ts,math.index(0,2)),
            math.subset(ts,math.index(1,2))
        )

        ctx.drawImage(
            this.img,
            0,                      //clip start x
            0,                      //clip start y
            this.img.width-0,         //clip width
            this.img.height-0,        //clip height
            0,//-this.center.x+0,
            0,//-this.center.y+0,
            this.img.width-0,
            this.img.height-0
        );
        ctx.restore();
    }
}

