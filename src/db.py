import asyncio
import shelve

from . import config


class DB:
    def __init__(self, db_file: str = config.DB_FILE):
        self._db_file = db_file
        self._lock = asyncio.Lock()

    def _with_lock(method):
        async def inner(self, *args, **kwargs):
            async with self._lock:
                return await method(self, *args, **kwargs)
        return inner

    @_with_lock
    async def get(self, key):
        with shelve.open(self._db_file, 'r') as db:
            return db.get(key)

    @_with_lock
    async def get_all(self):
        with shelve.open(self._db_file, 'r') as db:
            return list(db.values())

    @_with_lock
    async def set(self, key, value):
        with shelve.open(self._db_file) as db:
            db[key] = value

    @_with_lock
    async def delete(self, key):
        with shelve.open(self._db_file) as db:
            del db[key]


db = DB()
