'use strict'

class ToolsRenderer {
    constructor(...args) {
        this.cache = {}
        this.toolbuider = new ToolBuilder()
        if (args.length) {
            this.container = args[0]
            const self = this
            this.container.addEventListener("propchange", function(e) { self.changeTool(e.detail.obj) });
        }
        
    }

    prefetch() {
        for (const i in ToolsRenderer.association) {
            this.render(i)
        }
    }

    changeTool(obj) {
        if (ToolsRenderer.association[obj.constructor.name]) {
            if (!this.cache[obj.constructor.name]) {
                this.render(obj.constructor.name)
            }
            this.value(obj)
            $(this.container).children().detach()
            $(this.container).append(this.cache[obj.constructor.name].tool)
            return
        }
        console.warn(this.constructor.name + ': Not a valid type')
    }

    render(type) {
        const definition = ToolsRenderer.association[type]
        const cont = $('<div id="tool_' + type + '" style="overflow:scroll"></div>')
        this.cache[type] = {}
        this.cache[type].tool = cont
        //TODO: sostiturire con un oggetto durante la creazione dei bind si possono invertire le chiavi se utilizzo l'indice
        this.cache[type].bind = []
        this.cache[type].propOrder = []

        this.renderProperties(definition, this.cache[type].propOrder, this.cache[type], 0, cont)
    }


    renderProperties(def, propOrder, bind, b_idx, cont, rec = null) {
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
                    propOrder.push(key)

                    //caso in cui e' un oggetto ricorsivo
                    new_cont.append(this.renderProperties(definition, propOrder, bind, propOrder.length, new_cont, definition[key]))
                    cont.append(new_cont)
                    break;
            }
        }
        return cont
    }

    createBind(obj) {
        const order = this.cache[obj.constructor.name]
        //L'ARRAY NON DEVE ESSERE DISTRUTTO ALTRIMENTI I BIND VENGONO PERSI!!!
        order.bind.splice(0, order.bind.length)
        order.bind.push(obj)
        order.propOrder.forEach((e) => {
            if (typeof obj[e] == 'function') {
                order.bind.push(obj[e]())
            } else {
                order.bind.push(obj[e])
            }
        })
    }

    value(obj) {
        const typ = obj.constructor.name
        const definition = ToolsRenderer.association[typ]
        this.createBind(obj)
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
                    let o
                    if (typeof obj[i] == 'function') {
                        o = obj[i]()
                    } else {
                        o = obj[i]
                    }
                    this.valueProperties(definition, $('div[prop=' + i + ']', html), o, definition[i])
                    break;
            }
        }
    }
}

Object.defineProperty(ToolsRenderer, 'association', {
    value: Object.freeze({
        Point2D: __toolPoint2D,
        Line: __toolLine,
        Pivot: __toolPivot,
        Ellipse: __toolEllipse,
        Quadrangle: __toolQuadrangle
    })
})