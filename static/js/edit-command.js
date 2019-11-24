document.addEventListener('DOMContentLoaded', () => {
    const editor = ace.edit('editor')
    editor.setOptions({
        theme: 'ace/theme/tomorrow',
        fontSize: 18,
        showLineNumbers: false,
        showPrintMargin: false,
        mode: 'ace/mode/javascript'
    })
    editor.getSession().setUseWorker(false)

    document.querySelector('input[name="command"]').focus()
})

function saveCommand () {
    const formData = new FormData(document.querySelector('form'))
    const editor = ace.edit('editor')
    formData.set('code', editor.getValue())

    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/save-command', true)
    xhr.onload = function () {
        if (this.status === 200) {
            miro.showNotification('Command saved')
        } else {
            miro.showErrorNotification('Could not save command')
        }
    }
    xhr.send(formData)

    miro.board.ui.closeModal()

    return false // to prevent form submit
}
