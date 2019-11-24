from sanic import response
from sanic import Blueprint
from sanic import exceptions

from .db import db


api = Blueprint('api')


@api.post('/save-command')
async def save_command(request):
    command_name, description, code = (
        request.form.get('command'),
        request.form.get('description'),
        request.form.get('code'),
    )
    if not (command_name and code):
        raise exceptions.InvalidUsage('Required fields missing')

    await db.set(
        command_name,
        dict(
            name=command_name,
            description=description,
            code=code,
        ),
    )
    return response.json({'success': True})


@api.get('/get-commands')
async def get_commands(request):
    commands = await db.get_all()
    return response.json(commands)


@api.post('/remove-command')
async def remove_command(request):
    command_name = request.json['name']
    try:
        await db.delete(command_name)
    except KeyError:
        raise exceptions.NotFound('Command not found')

    return response.json({'success': True})
