let editor;

window.onload = function () {
    let c = document.querySelector("#c");
    let d = document.querySelector('#d')
    editor = new Editor({
        canvas: c,
        gridCanvas: d
    });
}
