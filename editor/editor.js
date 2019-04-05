let editor;
let raf

function draw() {
    cancelAnimationFrame(raf)
    let l = editor.world.elements[0]
    let el = editor.world.elements[1]
    
    l.rotateOnPoint(Math.PI/100 , l.pivot.x(), l.pivot.y())
    //el.rotateOnPoint(Math.PI/100 , el.pivot.x(), el.pivot.y())
    editor.draw()
    editor.clearForeground()
    editor.drawForeground()
    raf = requestAnimationFrame(draw)
}

window.onload = function () {
    let bg = document.querySelector("#bg");
    let data = document.querySelector("#data");
    let fg = document.querySelector("#fg");
    let p = document.querySelector('#properties_container')
    let cc = document.querySelector('#canvas_container')
    document.body.style.margin = 0
    fg.width = data.width = bg.width = window.innerWidth-120
    fg.height = data.height = bg.height = window.innerHeight*2/3
    editor = new Editor({
        dataCanvas: data,
        backgroundCanvas: bg,
        foregroundCanvas: fg,
        properties: p,
        canvasContainer: cc
    });

    //draw()

}
