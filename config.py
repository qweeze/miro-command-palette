import environs

env = environs.Env()
env.read_env('.env.local')

ENABLE_SSL = env.bool('ENABLE_SSL', default=False)
SSL_CERTFILE = env.str('SSL_CERTFILE')
SSL_KEYFILE = env.str('SSL_KEYFILE')

AUTO_RELOAD = env.bool('AUTO_RELOAD', default=False)
PORT = env.int('PORT', default=8000)
