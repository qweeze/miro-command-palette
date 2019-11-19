/* 
* Recognize text on a selected image via OCR API
* and create a sticker with recognized text
*/
const ocrSpaceApiKey = '<your-api-key-here>'
const image = (await miro.board.selection.get())[0]

if (!image || image.type !== 'IMAGE') {
    await miro.showErrorNotification('Please select an image')
    return
}

const apiUrl = 'https://api.ocr.space/parse/imageurl'
const urlParams = new URLSearchParams(
    Object.entries({
        url: image.url,
        apiKey: ocrSpaceApiKey,
        OCREngine: 2,
        fileType: 'PNG'
    })
)
const resp = await fetch(`${apiUrl}?${urlParams}`, { mode: 'no-cors' })
if (!resp.ok) {
    await miro.showErrorNotification('Could not process image')
    return
}
const result = await resp.json()

const recognizedText = (result.ParsedResults) ? result.ParsedResults[0].ParsedText : null
if (!recognizedText) {
    await miro.showErrorNotification('Could not recognize text')
    return
}

const created = await miro.board.widgets
    .create({type: 'TEXT', text: recognizedText})

await miro.board.viewport.zoomToObject(created[0])
