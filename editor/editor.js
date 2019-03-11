let editor;
let raf

function draw() {
    let l = editor.world.elements[0]
    let el = editor.world.elements[1]
    //l.rotate(Math.PI/100)
    l.rotateOnPoint(Math.PI / 100, l.pivot.x(), l.pivot.y())
    //el.rotateOnPoint(Math.PI / 100, el.pivot.x(), el.pivot.y())
    editor.draw()
    raf = requestAnimationFrame(draw)
}

window.onload = function () {
    let c = document.querySelector("#c");
    let d = document.querySelector('#d')
    document.body.style.margin = 0
    //c.width = window.innerWidth
    //c.height = window.innerHeight*2/3
    editor = new Editor({
        canvas: c,
        gridCanvas: c
    });

    //draw()

}
