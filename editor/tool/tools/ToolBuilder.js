'use strict'

class ToolBuilder {
    constructor() {
        this.cache = {}
    }

    renderNumeric(def, prop, b) {
        const div = $('<div></div>')
        const id = 'tbn_' + ToolBuilder.getId()
        const label = $('<label for="' + id + '">' + (def.label ? def.label : "") + '</label>')
        const inp = $('<input id="' + id + '" prop="' + prop + '" type="number" min="" max="" step=""></input>')
        inp.attr({
            min: def.min ? def.min : '',
            max: def.max ? def.max : '',
            step: def.precision ? 1 / Math.pow(10, def.precision) : ''
        })

        inp.on('change', function (e) {
            let v = parseFloat(e.target.value);
            if (v > def.max) {
                v = def.max
            }
            if (v < def.min) {
                v = def.min
            }
            if (def.precision) {
                v = Math.trunc(v * Math.pow(10, def.precision)) / Math.pow(10, def.precision)
            }
            inp.val(v)
            //TODO: togliere i try cat
            try {
                this.bind[prop](v)
            } catch (err) {
                this.bind[prop] = v
            }
        }.bind(b))

        div.append(label, inp)
        return div
    }

    valueNumeric(el, prop, obj) {
        const i = $('input[prop="' + prop + '"]', el)
        try {
            i.val(obj[prop]())
        } catch (err) {
            i.val(obj[prop])
        }
    }

    renderText(def, prop, b) {
        const div = $('<div></div>')
        const id = 'tbt_' + ToolBuilder.getId()
        const label = $('<label for="' + id + '">' + (def.label ? def.label : "") + '</label>')
        const inp = $('<input id="' + id + '" prop="' + prop + '" type="text"></input>')

        inp.on('change', function (e) {
            try {
                this.bind[prop](e.target.value)
            } catch (err) {
                this.bind[prop] = e.target.value
            }
        }.bind(b))

        div.append(label, inp)
        return div
    }

    valueText(el, prop, obj) {
        const i = $('input[prop="' + prop + '"]', el)
        try {
            i.val(obj[prop]())
        } catch (err) {
            i.val(obj[prop])
        }
    }

    renderColorPicker(def, prop, b) {
        const div = $('<div></div>')
        const id = 'tbcp_' + ToolBuilder.getId()
        const label = $('<label for="' + id + '">' + (def.label ? def.label : "") + '</label>')
        const inp = $('<input id="' + id + '" prop="' + prop + '" type="color"></input>')

        inp.on('change', function (e) {
            try {
                this.bind[prop](e.target.value)
            } catch (err) {
                this.bind[prop] = e.target.value;
            }
        }.bind(b))

        div.append(label, inp)
        return div
    }

    valueColorPicker(el, prop, obj) {
        const i = $('input[prop="' + prop + '"]', el)
        try {
            i.val(obj[prop]())
        } catch (err) {
            i.val(obj[prop])
        }
    }

    renderDropDown(def, prop, b) {
        const div = $('<div></div>')
        const id = 'tbdd_' + ToolBuilder.getId()
        const label = $('<label for="' + id + '">' + (def.label ? def.label : "") + '</label>')
        const inp = $('<select></select>').attr({
            id: id,
            prop: prop,
            type: 'color'
        })
        for (const i in def.options) {
            const opt = $('<option>' + i + '</option>').attr({
                value: def.options[i],
            })
            inp.append(opt)
        }

        inp.on('change', function (e) {
            try {
                this.bind[prop](e.target.value)
            } catch (err) {
                this.bind[prop] = e.target.value;
            }
        }.bind(b))

        div.append(label, inp)
        return div
    }

    valueDropDown(el, prop, obj) {
        const i = $('select[prop="' + prop + '"]', el)
        try {
            i.val(obj[prop]())
        } catch (err) {
            i.val(obj[prop])
        }
    }
}


Object.defineProperty(ToolBuilder, 'toolType', {
    value: Object.freeze({
        'text': 0,
        'numeric': 1,
        'colorpicker': 2,
        'slide': 3,
        'array': 4,
        'dropdown': 5,
        'button': 6,
    }),
    configurable: false,
    writable: false
});

Object.defineProperty(ToolBuilder, 'getId', {
    value: (function () {
        let i = 0;
        return function () {
            return i++;
        }
    })(),
    configurable: false,
    writable: false
})