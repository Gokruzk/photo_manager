from .generated.images_client import Prisma as PrismaImages


class PrismaConnection():
    def __init__(self):
        self.prisma = PrismaImages()

    async def connect(self):
        await self.prisma.connect()

    async def disconnect(self):
        await self.prisma.disconnect()
