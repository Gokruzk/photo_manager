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

    async def connect(self):
        await self.prisma.connect()

    async def disconnect(self):
        await self.prisma.disconnect()
