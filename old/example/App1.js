let c = document.querySelector("#c");
let ctx = c.getContext("2d");
let sel = document.querySelector("#sel");



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
    ctx.lineWidth = 1 / world.getScaleFactor.x;
    ctx.beginPath();
    ctx.moveTo( -1000000, 0);
    ctx.lineTo( 1000000, 0);
    ctx.lineWidth = 1 / world.getScaleFactor.y;
    ctx.moveTo(0, -1000000);
    ctx.lineTo(0, 1000000);
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

let net1 = new Net();
let net2 = new Net();
let net3 = new Net();

net1.setPoints(0,0,100,100)
net1.setWidth(30)

net2.setPoints(100,100,200,100)
net2.setWidth(30)

net3.setPoints(200,100,250,100)
net3.setWidth(50)

net1.buildPath();
net2.buildPath()
net3.buildPath()

let cursor = new Cursor()
let adder = new Adder();
adder.setCursor(cursor)

world.addElement(net1);
world.addElement(net2);
world.addElement(net3);

//world.addElement(cursor);

///////////////////////// event handler ////////////////////////////////

c.addEventListener("mousemove", function(e){
    let rect = e.target.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    if(drag){
        is_dragging = true;
        let sf = world.getScaleFactor
        let rest = {
            x : (x - drag_point.x),
            y : (y - drag_point.y)
        }
        world.translateAdd( rest.x, rest.y );
        drag_point = {
            x: x,
            y: y
        }
        world.applyTransform(ctx);
        draw();
    } else{
        
        e.preventDefault();
        let event = {
            x: x,
            y: y,
            parentTransformation: math.identity(3)
        }
        world.mousemove(event);

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
        let diff = math.multiply( math.inv(world.getTransformation), [x,y,1]);
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
        let wp = math.multiply(math.inv(world.getTransformation), math.matrix([x,y,1]))
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
        let wp = math.multiply(math.inv(world.getTransformation ), math.matrix([x,y,1]))
        el && el.scaleOnWorldPoint(z,z,math.subset(wp,math.index(0)), math.subset(wp,math.index(1)))
    }
    //rotazione veloce dell'oggetto
    if(!(mask ^ (ALT | CTRL | SHIFT))){
        let wp = math.multiply(math.inv(world.getTransformation), math.matrix([x,y,1]))
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
        let diff = math.multiply( math.inv(world.getTransformation), [x,y,1]);
        world.scaleOnPoint(z, z, math.subset(diff, math.index(0)), math.subset(diff, math.index(1)));
        
    }
    world.applyTransform(ctx)
    draw();
});