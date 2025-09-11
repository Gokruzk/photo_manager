from .generated.auth_client import Prisma as PrismaAuth


class PrismaConnection():
    def __init__(self):
        self.prisma = PrismaAuth()

    async def connect(self):
        await self.prisma.connect()

    async def disconnect(self):
        await self.prisma.disconnect()
