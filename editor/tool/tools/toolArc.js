const __toolArc = Object.assign({
    pivot: {
        type: 'Pivot',
        label: 'pivot'
    },
    center: {
        type: 'Point2D',
        label: 'center'
    },
    radius: {
        type: ToolBuilder.toolType.numeric,
        label: 'radius'
    },
    rotation: {
        type: ToolBuilder.toolType.numeric,
        label: 'rotation'
    },
    angles: {
        type : 'Point2D',
        label : 'angles'
    }
}, __toolStyle)

