import uvicorn
from pathlib import Path
from fastapi import FastAPI
from colorama import Fore, Style
from contextlib import asynccontextmanager
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware

from auth.infra.web.controllers import auth_router
from config.config import ServerConfig
from images.infra.web import image_router
from auth.infra.web.controllers import user_router

home = Path.home()
images_folder = Path(home, "Images_Photo_Manager")


def init_app():
    @asynccontextmanager
    async def lifespan(app: FastAPI):
        try:
            print(
                f"\n{Fore.GREEN}{Style.BRIGHT}Server started on port {ServerConfig.port()}\n"
            )
            yield
            print(
                f"\n{Fore.GREEN}{Style.BRIGHT}Server shutdown\n"
            )
        except Exception as e:
            print(f"\n{Fore.RED}Error: {str(e)}\n")
        finally:
            print(
                f"\n{Fore.YELLOW}{Style.BRIGHT}Server Shutdown\n"
            )

    # Docs setting
    docs_url = "/docs" if ServerConfig.environment() == "development" else None
    redoc_url = "/redoc" if ServerConfig.environment() == "development" else None
    openapi_url = "/api/openapi.json" if ServerConfig.environment() == "development" else None

    app = FastAPI(
        title="Gokruzk",
        description="Photo Manager API",
        version="0.0.1",
        lifespan=lifespan,
        docs_url=docs_url,
        redoc_url=redoc_url,
        openapi_url=openapi_url,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    return app


app = init_app()

# OAuth schema
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

app.include_router(auth_router.router)
app.include_router(user_router.router)
app.include_router(image_router.router)

# mount directory
app.mount("/images/image", StaticFiles(directory=images_folder), name="images")


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "backend",
        "version": "0.0.1",
    }


@app.get("/")
async def root():
    return {
        "message": "Photo Manager API",
        "version": "0.0.1",
        "docs": (
            "/docs" if ServerConfig.environment() == "development" else "Not available in production"
        ),
        "health": "/health",
    }

if __name__ == "__main__":
    uvicorn.run(
        app="main:app", host="0.0.0.0", port=ServerConfig.port(), reload=True, timeout_keep_alive=300
    )
