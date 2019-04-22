const __toolArc = Object.assign({
    pivot: {
        type: 'Pivot',
        label: 'Pivot'
    },
    center: {
        type: 'Point2D',
        label: 'Center'
    },
    /*startPoint: {
        type: 'Point2D',
        label: 'Start'
    },
    endPoint: {
        type: 'Point2D',
        label: 'End'
    },*/
    angle: {
        type: 'Point2D',
        label: 'Angle'
    },
    radiusLength: {
        type: ToolBuilder.toolType.numeric,
        label: 'Radius',
        precision: 1,
        min: 0
    },
    rotation: {
        type: ToolBuilder.toolType.dropdown,
        options: {'Clockwise': false, 'Anticlockwise': true},
        value: {'Clockwise': false, 'Anticlockwise': true},
        label: 'Rotation'
    },
}, __toolStyle)

