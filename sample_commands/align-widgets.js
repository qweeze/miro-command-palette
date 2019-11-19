/*
* Auto align widgets to grid
*/
const widgets = await miro.board.selection.get()
if (widgets.length < 2) {
    await miro.showErrorNotification('At least 2 widgets must be selected')
    return
}
const newPositions = calculatePositions(widgets)
await miro.board.widgets.update(newPositions)


function calculatePositions(widgets) {
    const minSide = Math.floor(Math.sqrt(widgets.length))
    // smallest possible rectangle to fit all widgets
    const [nRows, nCols] = [
        [minSide, minSide],
        [minSide + 1, minSide],
        [minSide + 1, minSide + 1]
    ].find(dims => dims[0] * dims[1] >= widgets.length)

    const [sortByX, sortByY] = [
        widgets => widgets.sort((w1, w2) => w1.x > w2.x),
        widgets => widgets.sort((w1, w2) => w1.y > w2.y)
    ]

    const sortedByY = sortByY(widgets)
    const rows = []
    // arrange widgets into rows of nCols trying to preserve initial ordering if possible
    for (i of Array(nRows).keys()) {
        row = sortedByY.slice(i * nCols, (i + 1) * nCols)
        rows.push(sortByX(row))
    }

    // each grid cell must be at least as large as the largest widget
    const [maxHeight, maxWidth] = [
        widgets.reduce((w1, w2) => w1.height > w2.height ? w1.height : w2.height),
        widgets.reduce((w1, w2) => w1.width > w2.width ? w1.width : w2.width)
    ]

    // preserving common centroid of selected widgets
    const [centerX, centerY] = [
        widgets.map(w => w.x).reduce((acc, val) => acc + val) / widgets.length,
        widgets.map(w => w.y).reduce((acc, val) => acc + val) / widgets.length
    ]

    const padding = 0.1 * (maxWidth + maxHeight)

    const [x0, y0] = [
        centerX - (nCols * (maxWidth + padding) / 2),
        centerY - (nRows * (maxHeight + padding) / 2)
    ]

    let [x, y] = [x0, y0]
    const newPositions = []
    // update positions elementwise left to right, top to bottom
    for (row of rows) {
        x = x0
        for (obj of row) {
            newPositions.push({ id: obj.id, x: x, y: y })
            x += maxWidth + padding
        }
        y += maxHeight + padding
    }
    return newPositions
}