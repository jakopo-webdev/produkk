# Produkk

A full-stack task management application built with **NestJS** (API) and **Angular** (UI).

---

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| API      | NestJS 11, TypeORM, PostgreSQL, JWT     |
| UI       | Angular 21, Tailwind CSS                |
| Auth     | JWT (Bearer token via HTTP interceptor) |

---

## Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [npm](https://www.npmjs.com/) v10+
- [PostgreSQL](https://www.postgresql.org/) v14+

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd produkk
```

### 2. Install all dependencies

```bash
npm install          # installs concurrently at the root
cd produkk-api && npm install
cd ../produkk-ui && npm install
cd ..
```

### 3. Configure the API environment

Create a `.env` file inside `produkk-api/` (copy the template below):

```env
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/produkk
JWT_SECRET=<your-random-secret>
JWT_EXPIRES_IN=7d
PORT=3009
```

> **Tip:** Generate a strong `JWT_SECRET` with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

### 4. Create the database

```bash
psql -U postgres -c "CREATE DATABASE produkk;"
```

The schema is managed by TypeORM and will be auto-created on first run (`synchronize: true` in development).

### 5. Run the project

```bash
# From the produkk/ root — starts API and UI concurrently
npm run dev
```

| Service | URL                    |
|---------|------------------------|
| API     | http://localhost:3009  |
| UI      | http://localhost:4209  |

Or run them individually:

```bash
npm run dev:api   # NestJS in watch mode
npm run dev:ui    # Angular dev server
```

---

## Available Scripts (root)

| Command        | Description                          |
|----------------|--------------------------------------|
| `npm run dev`     | Start API + UI concurrently          |
| `npm run dev:api` | Start API only (watch mode)          |
| `npm run dev:ui`  | Start UI only                        |

---

## Project Structure

```
produkk/
├── produkk-api/       # NestJS REST API
│   └── src/
│       ├── auth/        # Authentication (register, login, JWT)
│       ├── tasks/       # Task CRUD
│       └── users/       # User entity & service
└── produkk-ui/        # Angular SPA
    └── src/app/
        ├── core/        # Services, guards, interceptors (singletons)
        ├── features/    # Route-level page components
        └── layout/      # Shared layout components (Navbar)
```

---

## API Overview

Full API documentation is available in [`produkk-api/API.md`](produkk-api/API.md).

---

## License & Disclaimer

Copyright © 2026. All rights reserved.

Produkk is provided for **personal and authorized use only**. Any illicit use of Produkk — including but not limited to unauthorized access, data scraping, reverse engineering, or redistribution — is **strictly prohibited**. Any copyright infringement or violation of these terms may result in legal action.

Unauthorized use of this software in whole or in part, for any purpose not expressly permitted, is a violation of applicable copyright law.
