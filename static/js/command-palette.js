async function init () {
    const commands = await loadCommands()
    const palette = document.getElementById('palette')

    palette.addEventListener('input', (event) => {
        if (event.data) {
            autocomplete(palette.value)
        }
    })

    palette.addEventListener('keyup', async (event) => {
        switch (event.key) {
            case 'Enter':
                await dispatch(palette.value)
                break
            case 'Escape':
                await miro.board.ui.closeModal()
                break
        }
    })

    palette.focus()

    function autocomplete (text) {
        const commandName = Object.keys(commands)
            .find(cmdName => cmdName.startsWith(text.toLowerCase()))

        if (commandName) {
            // A poor man's auto completion via text range selection
            const completion = commandName.slice(text.length)
            const inputLength = palette.value.length
            palette.value = `${palette.value}${completion}`
            palette.setSelectionRange(inputLength, palette.value.length)
        }
    }

    /* Finds a command by name and invokes it */
    async function dispatch (commandText) {
        const commandName = Object.keys(commands)
            .find(cmdName => commandText.toLowerCase().startsWith(cmdName))

        if (!commandName) {
            await miro.showErrorNotification(`Unknown command ${commandText}`)
            return
        }
        // Remaining string will be treated as command arguments if present
        const args = commandText
            .slice(commandName.length)
            .split(' ')
            .filter(arg => arg.length > 0)

        const command = commands[commandName]
        await Promise.resolve(command.action(...args))

        if (!command.preventModalClose) {
            await miro.board.ui.closeModal()
        }
    }
}

async function loadCommands () {
    const userCommands = await (await fetch('/get-commands')).json()
    userCommands.map(cmd => {
        // A hack to allow `await` syntax in scripts
        const funcSrc = `return (async () => { ${cmd.code} })()`
        try {
            cmd.action = new Function(funcSrc)
        } catch (error) {
            console.log(`An error occurred while loading command ${cmd.name}: ${error}`)
        }
    })

    const commands = Object.fromEntries(
        [...builtInCommands, ...userCommands]
            .map(cmd => [cmd.name.toLowerCase(), cmd])
    )
    return commands
}

const builtInCommands = [
    {
        name: 'New command',
        description: 'Create a new command',
        async action () {
            await miro.board.ui.openModal('static/new-command.html')
        },
        preventModalClose: true
    },
    {
        name: 'Remove command',
        description: 'Remove a command by name',
        async action (cmdName) {
            if (!cmdName) {
                await miro.showErrorNotification('Provide a command name')
                return
            }
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
        }
    }
]

document.addEventListener('DOMContentLoaded', init)
