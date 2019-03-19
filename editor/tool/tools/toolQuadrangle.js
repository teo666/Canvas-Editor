const __toolQuadrangle = Object.assign({
    pivot: {
        type: 'Pivot',
        label: 'pivot'
    },

    corner: {
        type: ToolBuilder.toolType.arrayList,
        of: 'Point2D',
        label: 'corners'
    },


}, __toolStyle)