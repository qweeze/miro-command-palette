## Command palette 
A plugin for [Miro](https://miro.com) collaborative board that empowers users to extend built-in features and automate routine tasks by creating their own custom scripts

<p align="center">
    <img src="https://raw.githubusercontent.com/qweeze/miro-command-palette/master/docs/screenshot1.png" width="49.5%" title="Creating a command">
    <img src="https://raw.githubusercontent.com/qweeze/miro-command-palette/master/docs/screenshot2.png" width="49.5%" title="Manage your commands">
</p>

#### [Demo video](https://github.com/qweeze/miro-command-palette/blob/master/docs/demo.webm?raw=true)

### Usage
- [Install](https://miro.com/oauth/authorize/?response_type=code&client_id=3074457347007917373&redirect_uri=https://bot.now.im/oauth) plugin
- Fire up command palette by clicking its icon on board's bottom toolbar
- Enter <kbd>new</kbd> command to open command editor
- To edit, view and delete your commands use <kbd>manage</kbd> command

### Examples
- [Auto aligning widgets to grid](sample_commands/align-widgets.js)
- [Filter cards on a kanban board by assigned user](sample_commands/filter-cards-by-user.js)
- [Recognize text on an image](sample_commands/recognize-text.js)
- [Locate widgets on a board by text](sample_commands/find-widget.js)
- [Create/load a savepoint of a board](sample_commands/savepoint.js)

### Rationale and motivation
The idea of the plugin was inspired by Sublime's [command palette tool](https://sublime-text-unofficial-documentation.readthedocs.io/en/latest/extensibility/command_palette.html) which was also adopted by other modern IDE's and text editors (e.g. [VSCode](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette), 
[IDEA](https://www.jetbrains.com/help/idea/searching-everywhere.html#find_action)).

A significant amount of Miro customers are software development teams meaning there's a significant amount of programmers among Miro users. Having that in mind, this plugin aims to enhance developers' experience and to lower the barrier of entry into using Miro's SDK by introducing a developer-friendly tooling for scripting. The idea is that a simpler approach to using SDK features will encourage more users to take advantage of scripting for their own needs.

The core feature is a fast and easy way to extend built-in functionality as well as automate time-consuming tasks with ad-hoc scripts without having to create a full-fledged plugin, implement authorization, set up hosting, configure SSL, etc. One can think of this as somewhat similar to the capabilities that VBA scripting brings to MS Excel or Photoshop. 

Moreover, performing complex and/or repetitive actions with keyboard commands instead of navigating sophisticated UI might be a more convenient and familiar way to do things for certain categories of users.

### Features and improvements ideas

- More granular scoping of commands: i.e. introduce user, board, team and global scopes. That will allow to create commands for private usage only, board-specific commands, cross-board commands, and publicly accessible commands respectively.
- Fuzzy and smart text autocompletion with better UI, possibly based on a predictive semantic model trained on board's text content.
- User-defined keyboard shortucts (currenly not supported by the API)
- Client-side commands and widget data encryption to eliminate the possibility of users' data leakage even in case the backend is compromised. That could be especially useful for companies whose security policy prohibits sending sensitive data to external services. Another possible solution may be to host the plugin in-house storing private data on internal servers and to have a script/command that binds that data to widgets.
- Support attaching commands to event handlers to take advantage of event-driven macros, e.g. subscribe to specific widgets' updates and receive Slack notifications when they occur (doesn't seem doable at the moment without ugly hacks due to iframes and `Window.postMessage()` limitations).
- Support other programming languages for scripting (requires to implement API wrappers for those languages)

### Running locally
```bash
docker build -t miro-command-palette .
docker run \
    -e APP_SECRET=<app-secret> \
    -e REDIRECT_URI=<redirect-uri> \
    -p 8000:8000 \
    miro-command-palette
```
