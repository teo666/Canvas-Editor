const __toolLine = Object.assign({
    pivot: {
        type: 'Pivot',
        label: 'pivot'
    },
    start: {
        type: 'Point2D',
        label: 'start'
    },

    end: {
        type: 'Point2D',
        label: 'end'
    }
}, __toolStyle)

//per le linee non ha senso il fillstyle
delete __toolLine['fillStyle']