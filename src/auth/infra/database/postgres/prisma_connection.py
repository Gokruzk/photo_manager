from .generated.auth_client import Prisma as PrismaAuth


class SingletonMeta(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            instance = super().__call__(*args, **kwargs)
            cls._instances[cls] = instance
        return cls._instances[cls]


class PrismaManager(metaclass=SingletonMeta):
    def __init__(self):
        self.prisma = PrismaAuth()
        self._connected = False

    async def connect(self):
        if not self._connected:
            await self.prisma.connect()
            self._connected = True

    async def disconnect(self):
        if self._connected:
            await self.prisma.disconnect()
            self._connected = False
