# Photo Album Manager

## Backend

REST API for manage users' photos

## Installation and Configuration

### 1. Change directory

```bash
cd .\Backend\
```

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

You can choose between three types of database (postgres, mysql, mongo)

### Generate prisma client for postgres
```bash
uv run prisma generate --schema=.\images\infra\database\postgres\schema.prisma
```
### Make migrations
```bash
uv run prisma migrate dev --schema=.\images\infra\database\postgres\schema.prisma
```

### mysql
```bash

```
### Make migrations
```bash

```

### mongodb
```bash

```
### Make migrations
```bash

```

As you can see there are relationships between some tables. However, in the implementation I decide to seperate in specific databases for auth and images.

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

