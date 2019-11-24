async function newCommand () {
    await miro.board.ui.openModal('new-command')
}

async function editCommand (cmdName) {
    await miro.board.ui.openModal(`edit-command/${escape(cmdName || '')}`)
}

async function removeCommand (cmdName) {
    const resp = await fetch('/remove-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cmdName })
    })
    if (resp.ok) {
        await miro.showNotification(`Command ${cmdName} removed`)
    } else if (resp.status === 404) {
        await miro.showErrorNotification(`Command ${cmdName} not found`)
    } else {
        await miro.showErrorNotification('Could not remove command')
    }
    await miro.board.ui.openModal('commands-list')
}
