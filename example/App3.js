let c = document.querySelector("#c");
let ctx = c.getContext("2d");
let sel = document.querySelector("#sel");

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

let el = null;

const world = new World();

function draw_point(x,y,r){
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.strokeStyle = '#003300';
    ctx.stroke();
};

function draw_center(){
    draw_point(0,0,1);
};


function draw_axis(){
    ctx.lineWidth = 1 / world.getScaleFactor().x;
    ctx.beginPath();
    ctx.moveTo( -(2<<30), 0);
    ctx.lineTo( (2<<30), 0);
    ctx.lineWidth = 1 / world.getScaleFactor().y;
    ctx.moveTo(0, -(2<<30));
    ctx.lineTo(0, (2<<30));
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
    draw_center()
    world.draw();

}

const logo1 = new Logo();
const logo2 = new Logo();
const container1 = new Container({x: 500,y :500});
const container2 = new Container({x: 250,y :250});

container2.translate(50,20);
container1.translate(100,40);
container1.addElement(container2)
world.addElement(logo2)
world.addElement(container1);
container2.addElement(logo1);
logo1.scale(0.5,0.5);
logo1.translate(125,200)
logo2.translate(-500,0)
logo2.scale(0.5,1)
world.translate(500,300)

world.scale(0.5,0.5)

let vertices =[
    [0, 0],
    [100, 0],
    [-20, 50],
    [100, 100],
    [0,100]
]

let pentagon_vertices = [
    [-100, 0],
    [100, 0],
    [161.8, -190.2],
    [0, -307.7],
    [-161.8, -190.2],
]

let polygon = new Polygon({vertices: vertices})
let pentagon = new Polygon({vertices: pentagon_vertices})
polygon.translate(50,250)
container1.addElement(polygon);
world.addElement(pentagon)

world.applyTransform(ctx);

logo1.setSource("../img/arch_crop.png").then(e => {
    logo2.setSource("../img/arch_crop.png").then( e=> { 
        animationStart()
    })
});

let animation;

function step() {

    logo2.rotateZ(math.pi/300)
    container1.rotateOnElementPoint(math.pi/500,100,100)
    container2.rotateOnElementPoint(-math.pi/300,0,0)
    logo1.rotateOnElementPoint(math.pi/200,325,325);
    polygon.rotateOnElementPoint(-math.pi/200,0,0)
    pentagon.rotateOnElementPoint(math.pi/500,0,-137.63819204711734)
    draw();
    animation = window.requestAnimationFrame(step);
  }

function animationStop(){
    cancelAnimationFrame(animation);
}

function animationStart(){
    animation = window.requestAnimationFrame(step);
}

///////////////////////// event handler ////////////////////////////////

c.addEventListener("mousemove", function(e){
    let rect = e.target.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    //console.log(x,y)

    if(drag){
        is_dragging = true;
        let sf = world.getScaleFactor()
        let rest = {
            x : (x - drag_point.x) / sf.x,
            y : (y - drag_point.y) / sf.y
        }
        world.translate( rest.x, rest.y );
        drag_point = {
            x: x,
            y: y
        }
        world.applyTransform(ctx);
        draw();
    } else{
        
        e.preventDefault();
        //handle hitttest
        //el = world.hitTest(x,y);
        //console.log(el)
        //el = el[el.length - 1];
        //sel.innerHTML = (el && el.name) ? el.name : "";

    }
});

c.addEventListener("mousedown", function(e){
    e.preventDefault()
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
        e.preventDefault();
        //handle hitttest
        el = world.hitTest(x,y);
        console.log(el)
        el = el[el.length - 1];
        sel.innerHTML = (el && el.name) ? el.name : "";
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
            el && el.rotate(math.pi/100);
            break;
    }
    world.applyTransform(ctx);
    //draw();
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
        let diff = math.multiply( math.inv(world.getTransformation()), [x,y,1]);
        world.scaleOnPoint(z, z, math.subset(diff, math.index(0)), math.subset(diff, math.index(1)));
    }
    
    //zoom dell'oggetto
    if(!(mask ^ SHIFT)){
        let z = 0;
        if(math.sign(e.deltaY) > 0){
            z = zoom_out;
        } else {
            z = zoom_in;
        }
        el && el.scale(z,z)
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
        //el.rotate(rotate_angle * math.sign(e.deltaY));
        //prendo le coordinate del mouse e le porto nel mondo
        let wp = math.multiply(math.inv(world.getTransformation()), math.matrix([x,y,1]))
        el && el.rotateOnWorldPoint( math.sign(e.deltaY) * rotate_angle , math.subset(wp,math.index(0)), math.subset(wp,math.index(1)));
    }

    if(!(mask ^ (ALT | META))){
        
    }

    if(!(mask ^ ( META | CTRL))){
        world.translate(translatelL * e.deltaX,translatelL *e.deltaY)
    }

    if(!(mask ^ ( META | CTRL | ALT))){

    }

    if(!(mask ^ ( SHIFT | META ))){
        el && el.translate(translatel * e.deltaX, translatel * e.deltaY);
    }

    if(!(mask ^ ( SHIFT | META | ALT))){
    }

    if(!(mask ^ ( SHIFT | META | CTRL))){
        el && el.translate(translatelL * e.deltaX, translatelL * e.deltaY);
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
        let wp = math.multiply(math.inv(world.getTransformation()), math.matrix([x,y,1]))
        el && el.scaleOnWorldPoint(z,z,math.subset(wp,math.index(0)), math.subset(wp,math.index(1)))
    }
    //rotazione veloce dell'oggetto
    if(!(mask ^ (ALT | CTRL | SHIFT))){
        let wp = math.multiply(math.inv(world.getTransformation()), math.matrix([x,y,1]))
        el && el.rotateOnWorldPoint( math.sign(e.deltaY) * rotate_angleL , math.subset(wp,math.index(0)), math.subset(wp,math.index(1)));
    }
    //zoom normale
    if(!mask){
        let z = 0;
        if(e.deltaY < 0){
            z = zoom_in;
        } else{
            z = zoom_out;
        }
        let diff = math.multiply( math.inv(world.getTransformation()), [x,y,1]);
        world.scaleOnPoint(z, z, math.subset(diff, math.index(0)), math.subset(diff, math.index(1)));
        
    }
    world.applyTransform(ctx)
    draw();
});