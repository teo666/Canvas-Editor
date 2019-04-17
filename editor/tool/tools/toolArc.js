const __toolArc = Object.assign({
    pivot: {
        type: 'Pivot',
        label: 'Pivot'
    },
    center: {
        type: 'Point2D',
        label: 'Center'
    },
    startPoint: {
        type: 'Point2D',
        label: 'Start'
    },
    endPoint: {
        type: 'Point2D',
        label: 'End'
    },
    rotation: {
        type: ToolBuilder.toolType.dropdown,
        options: {'Clockwise': false, 'Anticlockwise': true},
        value: {'Clockwise': false, 'Anticlockwise': true},
        label: 'Rotation'
    },
}, __toolStyle)

