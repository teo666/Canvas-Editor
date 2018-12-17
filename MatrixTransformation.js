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
