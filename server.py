import asyncio
import dbm
import pathlib
import shelve
import ssl

from sanic import Sanic
from sanic import response
from sanic import exceptions

import config


app = Sanic()
app.static('/static', './static')

INDEX_PAGE = pathlib.Path('./static/index.html').read_text()
DB_FILE = 'commands.db'
_db_lock = asyncio.Lock()


@app.exception(exceptions.NotFound)
async def ignore_404s(request, exception):
    return response.text('Not found', status=404)


@app.route('/index.html')
async def index(request):
    return response.html(INDEX_PAGE)


@app.post('/save-command')
async def save_command(request):
    command_name, description, code = (
        request.form.get('command'),
        request.form.get('description'),
        request.form.get('code'),
    )
    if not (command_name and code):
        raise exceptions.InvalidUsage('Required fields missing')

    async with _db_lock:
        with shelve.open(DB_FILE) as db:
            db[command_name] = dict(
                name=command_name,
                description=description,
                code=code,
            )
    return response.json({'success': True})


@app.get('/get-commands')
async def get_commands(request):
    try:
        with shelve.open(DB_FILE, 'r') as db:
            commands = list(db.values())
    except dbm.error:
        commands = []

    return response.json(commands)


@app.post('/remove-command')
async def remove_command(request):
    command_name = request.json['name']
    async with _db_lock:
        with shelve.open(DB_FILE) as db:
            try:
                del db[command_name]
            except KeyError:
                raise exceptions.NotFound('Command not found')

    return response.json({'success': True})


if __name__ == '__main__':
    run_args = dict(host='0.0.0.0', port=config.PORT, auto_reload=config.AUTO_RELOAD)

    if config.ENABLE_SSL:
        context = ssl.create_default_context(purpose=ssl.Purpose.CLIENT_AUTH)
        context.load_cert_chain(config.SSL_CERTFILE, keyfile=config.SSL_KEYFILE)
        run_args['ssl'] = context

    app.run(**run_args)
