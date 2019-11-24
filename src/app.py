import pathlib
import typing as t

import jinja2
from sanic import Sanic
from sanic import response
from sanic import exceptions

from .api import api
from .db import db
from . import config


app = Sanic(name='miro-command-palette')
app.blueprint(api)
app.static('/static', config.STATIC_DIR)

INDEX_PAGE: str = (
    pathlib.Path(config.STATIC_DIR)
    .joinpath('index.html')
    .read_text()
)

_templates: t.Dict[str, jinja2.Template] = {
    p.stem: jinja2.Template(p.read_text())
    for p in pathlib.Path('templates').glob('*.html')
}


@app.exception(exceptions.NotFound)
async def ignore_404s(request, exception):
    return response.text('Not found', status=404)


@app.route('/index.html')
async def index(request):
    return response.html(INDEX_PAGE)


@app.get('commands-list')
async def commands_list(request):
    commands = await db.get_all()
    html = _templates['commands-list'].render(commands=commands)
    return response.html(html)


@app.get('new-command')
async def new_command(request):
    html = _templates['edit-command'].render(command=None)
    return response.html(html)


@app.get('edit-command/<command_name>')
async def edit_command(request, command_name):
    command = await db.get(command_name)
    html = _templates['edit-command'].render(command=command)
    return response.html(html)
