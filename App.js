let c = document.getElementById("c");
let ctx = c.getContext("2d");

const CTRL = 0b0001;
const ALT = 0b0010;
const SHIFT = 0b0100;
const META = 0b1000

let zoom_in = 1.05;
let zoom_out = 1/1.05;
let zoom_inL = 1.15;
let zoom_outL = 1/1.15;
let rotate_angle = math.pi / 500;
let rotate_angleL = math.pi / 50;
let translatel = 1;
let translatelL = 5;

let drag = false;
let drag_point = null;
let is_dragging = false;

const world = new World();

function draw_point(x,y){
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.strokeStyle = '#003300';
    ctx.stroke();
};

function draw_center(){
    draw_point(0,0);
};

function draw_axis(){
    ctx.lineWidth = 1 / world.getScaleFactor().x;
    ctx.beginPath();
    ctx.moveTo(-1000, 0);
    ctx.lineTo(1000, 0);
    ctx.lineWidth = 1 / world.getScaleFactor().y;
    ctx.moveTo(0, -1000);
    ctx.lineTo(0, 1000);
    ctx.stroke();
};

function clear(){
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.restore();
};

function draw(){
    clear();
    draw_axis();
    draw_center();
    draw_point(150,150)
    world.drawElements();
}

world.translateAdd(500,500);
world.scale(1,1);
world.applyTransform(ctx);

let el = new Logo();


el.setSource("./img/arch_crop.png").then(e =>{
    el.setCenter(el.getImageDimension().w / 2, el.getImageDimension().h / 2 );
    //el.scale(0.5,0.5)
    //el.rotate(math.pi/8)
    world.addElement(el);
    world.drawElements();
})

draw_center();
draw_axis();

///////////////////////// event handler ////////////////////////////////

c.addEventListener("mousemove", function(e){
    let rect = e.target.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    //console.log(x,y)

    if(drag){
        is_dragging = true;
        let tmp = world.getTranslationSkew();
        let rest = {
            x : (x - drag_point.x) / math.subset(tmp,math.index(0,0)),
            y : (y - drag_point.y) / math.subset(tmp,math.index(1,1))
        }
        world.translate( rest.x, rest.y );
        drag_point = {
            x: x,
            y: y
        }
        world.applyTransform(ctx);
        draw();
    }
});

c.addEventListener("mousedown", function(e){
    let rect = e.target.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    drag = true;
    drag_point = {
        x: x,
        y: y
    }

});

c.addEventListener("mouseup", function(e){
    let rect = e.target.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    if(!is_dragging){
        //handle hitttest
        let res = math.multiply(math.inv(world.getTransformation()), [x, y, 1]);
        console.log(world.hitTest(math.subset(res,math.index(0)), math.subset(res,math.index(1))));
    }
    is_dragging = false;
    drag = false;
});

c.addEventListener("mouseleave",function(){
    drag = false;
    is_dragging = false;
});

function get_mask(e){
    let m = 0b0000;
    if(e.ctrlKey){
        m |= CTRL;
    }
    if(e.altKey){
        m |= ALT;
    }
    if(e.shiftKey){
        m |= SHIFT;
    }
    if(e.metaKey){
        m |= META;
    }
    //console.log(m)
    return m;
}

document.body.addEventListener("keyup", function(e) {
    //console.log(e);
    switch(e.key){
        case "w":
            world.translateAdd(0,-10);
            break;
        case "s":
            world.translateAdd(0,10);
            break;
        case "a":
            world.translateAdd(-10,0);
            break;
        case "d":
            world.translateAdd(10,0);
            break;
        case "q":
            world.rotate(math.pi/20);
            break;
        case "e":
            world.rotate(-math.pi/20);
            break;
        case "z":
            world.scaleOnPoint(zoom_out,zoom_out,c.width/2,c.height/2);
            break;
        case "x":
            world.scaleOnPoint(zoom_in,zoom_in,c.width/2,c.height/2);
            break;
        case "n":
            el.rotate(math.pi/100);
            break;
    }
    world.applyTransform(ctx);
    draw();
});

c.addEventListener("wheel", function(e) {
    let rect = e.target.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    e.preventDefault();
    //console.log(e.metaKey)
    mask = get_mask(e);
    
    //rotazione globale
    if(!(mask ^ ALT)){
        world.rotate(math.sign(e.deltaY) * rotate_angle);
    }
    
    //zoom veloce
    if(!(mask ^ CTRL)){
        let z = 0;
        if(e.deltaY < 0){
            z = zoom_inL;
        } else{
            z = zoom_outL;
        }
        world.scaleOnPoint(z,z,x,y);
    }
    
    //zoom dell'oggetto
    if(!(mask ^ SHIFT)){
        let z = 0;
        if(math.sign(e.deltaY) > 0){
            z = zoom_out;
        } else {
            z = zoom_in;
        }
        el.scale(z,z)
    }

    if(!(mask ^ META)){
        world.translate(translatel * e.deltaX,translatel *e.deltaY)
    }
    //rotazione globale veloce
    if(!(mask ^ (ALT | CTRL) ) ){
        world.rotate(math.sign(e.deltaY) * rotate_angleL);
    }
    //rotazione dell'oggetto
    if(!(mask ^ (ALT | SHIFT))){
        el.rotate(rotate_angle * math.sign(e.deltaY));
    }

    if(!(mask ^ (ALT | META))){
        
    }

    if(!(mask ^ ( META | CTRL))){
        world.translate(translatelL * e.deltaX,translatelL *e.deltaY)
    }

    if(!(mask ^ ( META | CTRL | ALT))){

    }

    if(!(mask ^ ( SHIFT | META ))){
        el.translate(translatel * e.deltaX, translatel * e.deltaY);
    }

    if(!(mask ^ ( SHIFT | META | ALT))){
        }

    if(!(mask ^ ( SHIFT | META | CTRL))){
        el.translate(translatelL * e.deltaX, translatelL * e.deltaY);
    }

    if(!(mask ^ ( SHIFT | META | CTRL | ALT))){
       
    }


    
    //zoom velore dell'oggetto
    if(!(mask ^ (CTRL | SHIFT))){
        let z = 0;
        if(math.sign(e.deltaY) > 0){
            z = zoom_outL
        } else {
            z = zoom_inL;
        }
        el.scale(z,z)
    }
    //rotazione veloce dell'oggetto
    if(!(mask ^ (ALT | CTRL | SHIFT))){
        el.rotate(rotate_angleL * math.sign(e.deltaY));
    }
    //zoom normale
    if(!mask){
        let z = 0;
        if(e.deltaY < 0){
            z = zoom_in;
        } else{
            z = zoom_out;
        }
        world.scaleOnPoint(z,z,x,y);
    }
    world.applyTransform(ctx)
    draw();
});