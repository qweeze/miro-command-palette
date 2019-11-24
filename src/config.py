import pathlib

import environs


env = environs.Env()
if pathlib.Path('.env.local').exists():
    env.read_env('.env.local')


def _relpath(path: str) -> str:
    return str(pathlib.Path(__file__).parent / path)


ENABLE_SSL = env.bool('ENABLE_SSL', default=False)
SSL_CERTFILE = env.str('SSL_CERTFILE')
SSL_KEYFILE = env.str('SSL_KEYFILE')

AUTO_RELOAD = env.bool('AUTO_RELOAD', default=False)
PORT = env.int('PORT', default=8000)

DB_FILE = _relpath(env.str('DB_FILE', './commands.db'))
STATIC_DIR = _relpath(env.str('STATIC_DIR', '../static'))
TEMPLATES_DIR = _relpath(env.str('TEMPLATES_DIR', '../templates'))
