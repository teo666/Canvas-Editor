'use strict'

class ElementType {
    constructor(){

    }
}

Object.defineProperty(ElementType, 'Type',
    {
        value: {
            'ELEM' : Element,
            'COEL' : ControlElement
        },
        configurable: false,
        writable: false
    }
)