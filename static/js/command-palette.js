let commands = {}

async function init () {
    commands = await loadCommands()
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

    /* A poor man's auto completion via text range selection */
    function autocomplete (text) {
        const commandName = Object.keys(commands)
            .find(cmdName => cmdName.startsWith(text.toLowerCase()))

        if (commandName) {
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
        const command = commands[commandName]
        // Remaining string will be treated as command argument if present
        const arg = commandText.slice(commandName.length).trim()
        await Promise.resolve(command.action(...(arg) ? [arg] : []))

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
            cmd.action = async () => {
                await miro.showErrorNotification(`Could not load command ${cmd.name}`)
            }
            console.error(`An error occurred while loading command ${cmd.name}: ${error}`)
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
    },
    {
        name: 'Help',
        description: 'Show description of a command',
        async action (cmdName) {
            if (!cmdName) {
                await miro.showErrorNotification('Provide a command name')
                return
            }
            const command = commands[cmdName]
            if (!command) {
                await miro.showErrorNotification(`Command ${cmdName} not found`)
                return
            }
            await miro.showNotification(command.description)
        },
        preventModalClose: true
    }
]

document.addEventListener('DOMContentLoaded', init)
