let editor;
let raf

function draw() {
    cancelAnimationFrame(raf)
    let l = editor.world.elements[0]
    let el = editor.world.elements[1]
    
    l.rotateOnPoint(Math.PI/100 , l.pivot.x(), l.pivot.y())
    el.rotateOnPoint(Math.PI/100 , el.pivot.x(), el.pivot.y())
    editor.draw()
    raf = requestAnimationFrame(draw)
}

window.onload = function () {
    let c = document.querySelector("#c");
    let d = document.querySelector("#d");
    let p = document.querySelector('#properties_container')
    document.body.style.margin = 0
    d.width = c.width = window.innerWidth-120
    d.height = c.height = window.innerHeight*2/3
    editor = new Editor({
        canvas: c,
        gridCanvas: d,
        properties: p
    });

    //draw()

}
