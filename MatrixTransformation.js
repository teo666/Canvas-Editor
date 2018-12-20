let ts = math.matrix([[1.0,0,0],[0,1.0,0],[0,0,1.0]]);
let r = math.matrix([[1.0,0,0],[0,1.0,0],[0,0,1.0]]);

let transformation = math.matrix([[1.0,0,0],[0,1.0,0],[0,0,1.0]]);

function translate(x,y) {
    let tm = math.matrix([[1.0,0,x],[0,1.0,y],[0,0,1.0]]);
    ts = math.multiply(ts, tm);
}

function translateAdd(x,y){
    let tm = math.matrix([[0,0,x],[0,0,y],[0,0,0]]);
    ts = math.add(ts, tm);
}

function rotate(teta) {
    let cos = math.cos(teta);
    let sin = math.sin(teta);
    let tm = math.matrix([[cos,sin,0],[-sin,cos,0],[0,0,1]]);
    r = math.multiply(r, tm);
}

function scale(w,h) {
    let tm = math.matrix([[w,0,0],[0,h,0],[0,0,1]]);
    ts = math.multiply(ts, tm);
}

function scale_on_point(w,h,cx,cy){
    let old_point = math.multiply(math.inv(transformation), [cx,cy,1]);
    scale(w,h);
    transformation = math.multiply(ts, r);
    // = res;
    let new_point = math.multiply(math.inv(transformation), [cx,cy,1]);
    let diff = math.subtract(new_point, old_point);
    translate(math.subset(diff,math.index(0)),math.subset(diff,math.index(1)));
    //applyTransform(ctx);
}

function applyTransform(ctx){
    transformation = math.multiply(ts, r);
    //res = math.multiply(res, r);
    //transformation = res;
    ctx.setTransform(
        math.subset(transformation,math.index(0,0)),
        math.subset(transformation,math.index(1,0)),
        math.subset(transformation,math.index(0,1)),
        math.subset(transformation,math.index(1,1)),
        math.subset(transformation,math.index(0,2)),
        math.subset(transformation,math.index(1,2))
    )
}