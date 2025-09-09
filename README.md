# Photo Album Manager

## Backend

REST API for manage users' photos.   
Developing this project was a very interesting experience. It made me realize how important it is to have a well-structured project that allows changes and scaling without breaking everything. You can check [old_architecture](https://github.com/Gokruzk/photo_manager/tree/old_architecture) branch and you’ll see how everything was coupled. I also got in touch with testing for the first time, and thanks to this architecture, it was easier to understand how to write them.   

## Installation and Configuration

### 1. Change directory

```bash
cd .\Backend\
```

### 1. Install uv

This project uses [uv](https://docs.astral.sh/uv), a fast Python package and environment manager (alternative to pip + venv/poetry).

```bash
pip install uv
```
Create the virtual environment to manage the project dependencies. 

### 2. Init uv

```bash
uv init
```

### 3. Install dependencies

```bash
uv sync
```

### 4. Create the .env from env_template.txt file

```bash
copy .\env_template.txt .env
```

### 5. Run

```bash
uv run main.py
```

## Tests
```bash
uv run pytest
```

## Database

You can choose between PostgreSQL (Prisma) or MySQL (SQLAlchemy).

### PostgreSQL (Prisma)

### Generate prisma client for postgres
```bash
uv run prisma generate --schema=.\images\infra\database\postgres\schema.prisma
```
```bash
uv run prisma generate --schema=.\auth\infra\database\postgres\schema.prisma
```
### Run migrations
```bash
uv run prisma migrate dev --schema=.\images\infra\database\postgres\schema.prisma
```
### Run migrations
```bash
uv run prisma migrate dev --schema=.\auth\infra\database\postgres\schema.prisma
```

### MySQL (SQLAlchemy)
Currently in progress.

### Entity Relationship Model and Entity Relationship Diagram
As you can see there are relationships between some tables. However, in the implementation I decide to seperate in specific databases for auth and images.

<img src="https://github.com/Gokruzk/photo_manager/blob/main/Backend/db_diagram.png" height=500 width=700 alt="database model">

## Architecture

<img src="https://github.com/Gokruzk/photo_manager/blob/main/Backend/hexagonal_architecture.png" height=500 width=700 alt="hexagonal architecture">

## Frontend

This is a Next.js project

## Installation and Configuration

### 1. Install dependencies

```bash
npm install
```

### 2. Run

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

