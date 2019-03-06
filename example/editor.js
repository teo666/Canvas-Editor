let editor;
let raf

function draw(){
    let l = editor.world.elements[0]
    //l.rotate(Math.PI/100)
    l.rotateOnPoint(Math.PI/100,l.pivot.x(), l.pivot.y())
    editor.draw()
    raf = requestAnimationFrame(draw)
}

window.onload = function () {
    let c = document.querySelector("#c");
    let d = document.querySelector('#d')
    editor = new Editor({
        canvas: c,
        gridCanvas: d
    });

    //draw()
    
}
