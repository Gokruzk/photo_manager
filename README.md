# Photo Album Manager

## Backend

REST API made with FastAPI, PrismaORM and PostgreSQL for manage users' photos

## Installation and Configuration

### 1. Install uv

First, create a virtual environment to manage the project dependencies.

```bash
pip install uv
```

### 2. Init uv

```bash
uv init
```

### 3. Install dependencies

```bash
uv sync
```

### 4. Generate Prisma client

```bash
uv run prisma generate
```

### 5. Create database

```bash
uv run prisma migrate dev
```

### 6. Create the .env from env_template.txt file

```bash
copy .\env_template.txt .env
```

### 7. Run

```bash
uv run main.py
```

## Database

Schema: public  
Database: photo_manager  
<img src="https://github.com/Gokruzk/photo_manager/blob/main/Backend/db_diagram.png" height=500 width=700 alt="database model">

## Architecture

<img src="https://github.com/Gokruzk/photo_manager/blob/auth_hex/Backend/hexagonal_architecture.png" height=500 width=700 alt="hexagonal architecture">

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

