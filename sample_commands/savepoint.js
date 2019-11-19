/*
* Save and load board state
*/
const widgets = await miro.board.widgets.get()

if (arguments[0] == 'load') {
    const savedWidgets = JSON.parse(localStorage.getItem('board-snapshot'))
    if (savedWidgets === null) {
        await miro.showErrorNotification('No savepoint found')
        return
    }
    await miro.board.widgets.deleteById(widgets.map(w => w.id))
    await miro.board.widgets.create(savedWidgets)
    await miro.showNotification('Savepoint loaded')
} else {
    localStorage.setItem('board-snapshot', JSON.stringify(widgets))
    await miro.showNotification('Savepoint created')
}
