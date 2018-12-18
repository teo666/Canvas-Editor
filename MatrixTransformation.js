let t = math.matrix([[1.0,0,0],[0,1.0,0],[0,0,1.0]]);
let r = math.matrix([[1.0,0,0],[0,1.0,0],[0,0,1.0]]);
let s = math.matrix([[1.0,0,0],[0,1.0,0],[0,0,1.0]]);
let transformation = math.matrix([[1.0,0,0],[0,1.0,0],[0,0,1.0]]);

function translate(x,y) {
    let tm = math.matrix([[1.0,0,x],[0,1.0,y],[0,0,1.0]]);
    t = math.multiply(t, tm);
    //console.log(translations)
}

function rotate(teta) {
    let cos = math.cos(teta);
    let sin = math.sin(teta);
    let tm = math.matrix([[cos,sin,0],[-sin,cos,0],[0,0,1]]);
    r = math.multiply(r, tm);
}

function scale(w,h) {
    let tm = math.matrix([[w,0,0],[0,h,0],[0,0,1]]);
    s = math.multiply(s, tm);
}

function scale_on_point(w,h,cx,cy){
    let old_point = math.multiply(transformation, [cx,cy,1]);
    scale(w,h);
    let res = math.multiply(t, r);
    res = math.multiply(res, s);
    transformation = res;
    let new_point = math.multiply(transformation, [cx,cy,1]);
    let diff = math.subtract(old_point, new_point);
    translate(math.subset(diff,math.index(0)),math.subset(diff,math.index(1)));
    applyTransform(ctx);
}

function applyTransform(ctx){
    let res = math.multiply(t, s);
    res = math.multiply(res, r);
    transformation = res;
    ctx.setTransform(
        math.subset(res,math.index(0,0)),
        math.subset(res,math.index(1,0)),
        math.subset(res,math.index(0,1)),
        math.subset(res,math.index(1,1)),
        math.subset(res,math.index(0,2)),
        math.subset(res,math.index(1,2))
    )
}

/////////\\\\\\\\\\\

function el(){
    this.init();
    this.setCenter();
    this.img = new Image();
    this.img.src = "./arch_crop.png";
}

el.prototype.init = function(){
    this.transformation = math.matrix([[1.0,0,0],[0,1.0,0],[0,0,1.0]]);
    this.r = math.matrix([[1.0,0,0],[0,1.0,0],[0,0,1.0]]);
    this.s = math.matrix([[1.0,0,0],[0,1.0,0],[0,0,1.0]]);
    this.t = math.matrix([[1.0,0,0],[0,1.0,0],[0,0,1.0]]);
}

el.prototype.setCenter = function(x,y){
    this.center = {};
    this.center.x = x || 0;
    this.center.y = y || 0;
}

el.prototype.scale = function(h,w){
    let tm = math.matrix([[w,0,0],[0,h,0],[0,0,1]]);
    this.s = math.multiply(this.s, tm);
    this.applyTransform();
}

el.prototype.translate = function(x,y){
    let tm = math.matrix([[1.0,0,x],[0,1.0,y],[0,0,1.0]]);
    this.t = math.multiply(this.t, tm);
    this.applyTransform();
}

el.prototype.rotate = function(teta){
    let cos = math.cos(teta);
    let sin = math.sin(teta);
    let tm = math.matrix([[cos,sin,0],[-sin,cos,0],[0,0,1]]);
    this.r = math.multiply(this.r, tm);
    this.applyTransform();
}

el.prototype.applyTransform = function(){
    let res = math.multiply(this.t, this.s);
    res = math.multiply(res, this.r);
    this.transformation = res;
}

el.prototype.draw = function(){
    ctx.save();

    let ts = math.multiply(transformation, this.transformation);
    
    ctx.setTransform(
        math.subset(ts,math.index(0,0)),
        math.subset(ts,math.index(1,0)),
        math.subset(ts,math.index(0,1)),
        math.subset(ts,math.index(1,1)),
        math.subset(ts,math.index(0,2)),
        math.subset(ts,math.index(1,2))
    )
    /*ctx.drawImage(
        this.img,
        200,                      //clip start x
        300,                      //clip start y
        this.img.width-220,         //clip width
        this.img.height-230,        //clip height
        -this.center.x+200,
        -this.center.y+300,
        this.img.width-220,
        this.img.height-230
    );
    */
    ctx.drawImage(
        this.img,
        0,                      //clip start x
        0,                      //clip start y
        this.img.width-0,         //clip width
        this.img.height-0,        //clip height
        -this.center.x+0,
        -this.center.y+0,
        this.img.width-0,
        this.img.height-0
    );
    ctx.restore();
}