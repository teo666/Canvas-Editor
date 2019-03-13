'use strict'

class ToolsRenderer {
    constructor() {
        this.cache = {}
        this.toolbuider = new ToolBuilder()
    }

    render(obj) {
        const definition = ToolsRenderer.association[obj.constructor.name]
        const cont = $('<div id="tool_container"></div>')
        this.cache[obj.constructor.name] = {}
        this.cache[obj.constructor.name].tool = cont
        //TODO: sostiturire con un oggetto durante la creazione dei bind si possono invertire le chiavi se utilizzo l'indice
        this.cache[obj.constructor.name].bind = [obj]

        this.renderProperties(definition, this.cache[obj.constructor.name].bind, 0, cont)
    }


    renderProperties(def, bind, b_idx, cont, rec = null) {
        let definition
        if (rec) {
            definition = ToolsRenderer.association[rec.type]
        } else {
            definition = def
        }
        for (let key in definition) {

            switch (definition[key].type) {
                case ToolBuilder.toolType.numeric:
                    cont.append(this.toolbuider.renderNumeric(definition[key], key, { bind: bind, bind_index: b_idx }))
                    break;

                case ToolBuilder.toolType.text:
                    cont.append(this.toolbuider.renderText(definition[key], key, { bind: bind, bind_index: b_idx }))
                    break;

                case ToolBuilder.toolType.colorpicker:
                    cont.append(this.toolbuider.renderColorPicker(definition[key], key, { bind: bind, bind_index: b_idx }))
                    break;

                case ToolBuilder.toolType.dropdown:
                    cont.append(this.toolbuider.renderDropDown(definition[key], key, { bind: bind, bind_index: b_idx }))
                    break;
                default:
                    const new_cont = $('<div></div>').attr({ prop: key })
                    new_cont.append($('<label>' + definition[key].label + '</label>'))
                    bind.push(bind[b_idx][key]())
                    //caso in cui e' un oggetto ricorsivo
                    new_cont.append(this.renderProperties(definition, bind, bind.length-1, new_cont, definition[key]))
                    cont.append(new_cont)
                    break;
            }
        }
        return cont
    }



    //TODO: da finire
    value(obj) {
        const typ = obj.constructor.name
        const definition = ToolsRenderer.association[typ]
        this.cache[obj.constructor.name].bind = obj
        this.valueProperties(definition, this.cache[obj.constructor.name].tool, obj)
    }

    valueProperties(def, html, obj, rec = null) {
        let definition
        if (rec) {
            definition = ToolsRenderer.association[rec.type]
        } else {
            definition = def
        }
        for (let i in definition) {
            switch (definition[i].type) {
                case ToolBuilder.toolType.numeric:
                    this.toolbuider.valueNumeric(html, i, obj)
                    break;
                case ToolBuilder.toolType.text:
                    this.toolbuider.valueText(html, i, obj)
                    break;
                case ToolBuilder.toolType.colorpicker:
                    this.toolbuider.valueColorPicker(html, i, obj)
                    break;
                case ToolBuilder.toolType.dropdown:
                    this.toolbuider.valueDropDown(html, i, obj)
                    break;
                default:
                    //debugger
                    this.valueProperties(definition, $('div[prop=' + i + ']', html), obj[i](), definition[i])
                    break;
            }
        }
    }
}

Object.defineProperty(ToolsRenderer, 'association', {
    value: Object.freeze({
        Point2D: __toolPoint2D,
        Line: __toolLine,

    })
})