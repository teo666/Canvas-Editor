const __toolStyle = {
    strokeStyle: {
        label: 'stroke',
        type: ToolBuilder.toolType.text
    },
    fillStyle: {
        label: 'fill',
        type: ToolBuilder.toolType.colorpicker
    },
    lineWidth: {
        label: 'width',
        type: ToolBuilder.toolType.numeric,
        min: 0
    },
    /*lineDash: {
        type: ToolBuilder.toolType.array
},*/
    lineCap: {
        label: 'line cap',
        type: ToolBuilder.toolType.dropdown,
        options: CanvasStyle.lineCap,
        value: CanvasStyle.lineCap
    },
    lineJoin: {
        label: 'line join',
        type: ToolBuilder.toolType.dropdown,
        options: CanvasStyle.lineJoin,
        value: CanvasStyle.lineJoin
    },
    shadowColor: {
        label: 'shadow color',
        type: ToolBuilder.toolType.colorpicker
    },
    shadowBlur: {
        label: 'shadow blur',
        type: ToolBuilder.toolType.numeric,
        min: 0,
        precision: -1
    }

}