const __toolEllipse = Object.assign({
    pivot: {
        type: 'Pivot',
        label: 'pivot'
    },
    center: {
        type: 'Point2D',
        label: 'center'
    },
    radius: {
        type: 'Point2D',
        label: 'radius'
    },
    rotation: {
        type: ToolBuilder.toolType.numeric,
        label: 'rotation',
        precision: 1
    }
}, __toolStyle)
