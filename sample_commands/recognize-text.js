/* 
* Recognize text on a selected image via OCR API
* and create a sticker with recognized text
*/
const apiUrl = 'https://api.ocr.space/parse/imageurl'
const ocrSpaceApiKey = '<your-api-key-here>'

const image = (await miro.board.selection.get())[0]
if (!image || image.type !== 'IMAGE') {
    await miro.showErrorNotification('Please select an image')
    return
}

let recognizedText
try {
    recognizedText = await recognizeImage(image.url)
} catch (error) {
    await miro.showErrorNotification(error.message)
    return
}

const created = await miro.board.widgets
    .create({type: 'TEXT', text: recognizedText})

await miro.board.viewport.zoomToObject(created[0])


async function recognizeImage(imageUrl) {
    const urlParams = new URLSearchParams(
        Object.entries({
            url: imageUrl,
            apiKey: ocrSpaceApiKey,
            OCREngine: 2,
            fileType: 'PNG'
        })
    )
    const resp = await fetch(`${apiUrl}?${urlParams}`, { mode: 'no-cors' })
    if (!resp.ok) {
        throw Error('Could not process image')
    }
    const result = await resp.json()

    const text = (result.ParsedResults) ? result.ParsedResults[0].ParsedText : null
    if (!text) {
        throw error('Could not recognize text')
    }
    return text
}
