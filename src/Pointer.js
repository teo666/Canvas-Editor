'use strict'

class Pointer {
    constructor(){

    }

    onMouseDown(editor, etype, e){
        let rect = e.target.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        console.log( editor.world.hitTest(x, y, editor.context))
    }
}