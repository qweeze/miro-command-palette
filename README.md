## Command palette 
A plugin for [miro](https://miro.com) collaborative board that empowers users to automate routine tasks by creating their own custom scripts

<p align="center">
    <img src="docs/screenshot1.png" width="49.5%" title="Creating a command">
    <img src="docs/screenshot2.png" width="49.5%" title="Manage your commands">
</p>

[Demo video](https://github.com/qweeze/miro-command-palette/blob/master/docs/demo.webm?raw=true)


### Usage
- [Install](https://miro.com/oauth/authorize/?response_type=code&client_id=3074457347007917373&redirect_uri=https://bot.now.im/oauth) plugin
- Fire up command palette by clicking its icon on board's bottom toolbar
- Enter `new` command to open command editor
- To edit, view and delete your commands use `manage` command

### Examples
- [Auto aligning widgets to grid](sample_commands/align-widgets.js)
- [Filter cards on a kanban board by assigned user](sample_commands/filter-cards-by-user.js)
- [Recognize text on an image](sample_commands/recognize-text.js)
- [Locate widgets on a board by text](sample_commands/find-widget.js)
- [Create/load a savepoint of a board](sample_commands/savepoint.js)


### Running locally
```bash
docker build -t miro-command-palette .
docker run \
    -e APP_SECRET=<app-secret> \
    -e REDIRECT_URI=<redirect-uri> \
    -p 8000:8000 \
    miro-command-palette
```
