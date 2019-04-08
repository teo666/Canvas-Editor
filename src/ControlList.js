'use strict'

class ControlList {
    constructor(){
        this.list = []
    }

    add(e) {
        if (e instanceof ControlElement) {
            this.list.push(e)
            return
        }
        throw "Invalid arguments"
    }

    draw(contextes, parentT) {
        for(let i = this.list.length - 1; i >=0; i--){
            this.list[i].draw(contextes, parentT)
        }
    }
}