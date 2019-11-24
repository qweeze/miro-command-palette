import ssl

from .app import app
from . import config


if __name__ == '__main__':
    run_args = dict(host='0.0.0.0', port=config.PORT, auto_reload=config.AUTO_RELOAD)

    if config.ENABLE_SSL:
        context = ssl.create_default_context(purpose=ssl.Purpose.CLIENT_AUTH)
        context.load_cert_chain(config.SSL_CERTFILE, keyfile=config.SSL_KEYFILE)
        run_args['ssl'] = context

    app.run(**run_args)
