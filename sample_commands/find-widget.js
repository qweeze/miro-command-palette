/* 
* Zoom to the first found widget which text matches search query
*/
const searchQuery = arguments[0]
if (!searchQuery) {
    await miro.showErrorNotification('Search query missing')
    return
}
const widgets = await miro.board.widgets.get()
const foundWidget = widgets.find(w => (w.text) ? w.text.includes(searchQuery) : false)
if (foundWidget) {
    await miro.board.viewport.zoomToObject(foundWidget)
} else {
    await miro.showErrorNotification(`${searchQuery} not found`)
}
