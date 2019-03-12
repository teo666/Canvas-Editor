'use strict'

class ToolsRenderer {
    constructor() {
        this.cache = {}
        this.toolbuider = new ToolBuilder()
    }

    render(obj) {
        const definition = ToolsRenderer.association[obj.constructor.name]
        if (definition) {
            const cont = $('<div><div>')
            this.cache[obj.constructor.name] = {}
            this.cache[obj.constructor.name].tool = cont
            this.cache[obj.constructor.name].bind = obj
            for (const i in definition) {
                switch (definition[i].type) {
                    case ToolBuilder.toolType.numeric:
                        cont.append(this.toolbuider.renderNumeric(definition[i], i, this.cache[obj.constructor.name]))
                        break;

                    case ToolBuilder.toolType.text:
                        cont.append(this.toolbuider.renderText(definition[i], i, this.cache[obj.constructor.name]))
                        break;

                    case ToolBuilder.toolType.colorpicker:
                        cont.append(this.toolbuider.renderColorPicker(definition[i], i, this.cache[obj.constructor.name]))
                        break;

                    case ToolBuilder.toolType.dropdown:
                        cont.append(this.toolbuider.renderDropDown(definition[i], i, this.cache[obj.constructor.name]))
                        break;
                    default:
                        break;
                }
            }
        }
    }
    //TODO: da finire
    value(obj) {
        const definition = ToolsRenderer.association[obj.constructor.name]
        if (definition) {
            for (const i in definition) {
                switch (definition[i].type) {
                    case ToolBuilder.toolType.numeric:
                        this.toolbuider.valueNumeric(this.cache[obj.constructor.name].tool, i, obj)
                        break;
                    case ToolBuilder.toolType.text:
                        this.toolbuider.valueText(this.cache[obj.constructor.name].tool, i, obj)
                        break;
                    case ToolBuilder.toolType.colorpicker:
                        this.toolbuider.valueColorPicker(this.cache[obj.constructor.name].tool, i, obj)
                        break;
                    case ToolBuilder.toolType.dropdown:
                        this.toolbuider.valueDropDown(this.cache[obj.constructor.name].tool, i, obj)
                        break;
                    default:
                        break;
                }
            }
            this.cache[obj.constructor.name].bind = obj
        }
    }
}

Object.defineProperty(ToolsRenderer, 'association', {
    value: Object.freeze({
        Point2D: __toolPoint2D,
        Line: __toolLine,

    })
})