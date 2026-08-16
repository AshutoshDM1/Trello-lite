# 🚀 TaskFlow — Trello Lite

A modern, full-stack task management application built with **React 19**, **TypeScript**, **Tailwind CSS v4**, **Node.js Express**, **Drizzle ORM**, **Neon PostgreSQL**, and **Better Auth**.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture & Database Schema](#-architecture--database-schema)
- [REST API Reference](#-rest-api-reference)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation & Setup](#installation--setup)
  - [Database Migration & Seeding](#database-migration--seeding)
  - [Running the Project](#running-the-project)
- [Automated Testing](#-automated-testing)
- [Deployment](#-deployment)
- [Technical Decisions & Lessons Learned](#-technical-decisions--lessons-learned)

---

## 🌟 Overview

**TaskFlow (Trello Lite)** allows teams to organize tasks visually across columns (_To Do_, _In Progress_, _Done_), filter by priority (_High_, _Medium_, _Low_), track pipeline analytics in real time, and manage task lifecycle with zero friction.

---

## ✨ Key Features

- **Interactive Kanban Task Board**: Create, edit, delete, and move tasks between status columns.
- **Real-Time Workspace Overview & Analytics**: Live KPI cards (Total Tasks, Completed Tasks, In Progress, Action Required), pipeline stage breakdown bar chart, priority distribution bars, and active member counter.
- **Priority Filtering & Search**: Instant client-side search and query-based filtering (_All_, _High_, _Medium_, _Low_).
- **Zod Input Validation**: Strict validation rejecting empty titles, invalid priorities, or missing column references with clear HTTP 400 feedback.
- **Authentication & RBAC**: Better-Auth integration with session management and Role-Based Access Control (Admin/Member).
- **OpenAPI / Swagger Documentation**: Interactive API documentation at `/docs`.
- **Aesthetic UI**: Minimalist, glassmorphism design supporting **Dark** and **Light** modes seamlessly with smooth `framer-motion` animations.

---

## 🛠️ Tech Stack

### Frontend (`apps/web`)

- **Core**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Shadcn UI primitives, Class Variance Authority
- **Icons & Animations**: Lucide Icons, Framer Motion
- **State & Data Fetching**: TanStack React Query v5, Axios, Zustand

### Backend (`apps/server`)

- **Core**: Node.js, Express 5, TypeScript
- **Database Layer**: Neon Serverless PostgreSQL, Drizzle ORM
- **Auth & Validation**: Better Auth, Zod 4
- **Testing & Documentation**: Vitest, Swagger UI Express

---

## 📐 Architecture & Database Schema

```mermaid
erDiagram
    boards ||--|{ columns : "contains"
    columns ||--|{ tasks : "contains"
    user ||--|{ session : "has"
    user ||--|{ account : "has"

    boards {
        string id PK
        string name
        timestamp createdAt
        timestamp updatedAt
    }

    columns {
        string id PK
        string name
        string boardId FK
        integer position
        timestamp createdAt
        timestamp updatedAt
    }

    tasks {
        string id PK
        string title
        string description
        string columnId FK
        string priority
        timestamp createdAt
        timestamp updatedAt
    }
```

---

## 📡 REST API Reference

All API routes are prefixed under `/api/v1`. Interactive documentation is available at `http://localhost:3000/docs`.

| Method   | Endpoint                     | Description                                                      |
| :------- | :--------------------------- | :--------------------------------------------------------------- |
| `GET`    | `/api/v1/boards`             | List all boards                                                  |
| `GET`    | `/api/v1/boards/:id`         | Get board details with nested columns & tasks (`?priority=...`)  |
| `GET`    | `/api/v1/tasks`              | Fetch tasks with optional filters (`?priority=...&columnId=...`) |
| `POST`   | `/api/v1/tasks`              | Create a new task (Zod validated)                                |
| `PATCH`  | `/api/v1/tasks/:id`          | Update task details (title, description, priority, column)       |
| `PATCH`  | `/api/v1/tasks/:id/move`     | Move task to a target column                                     |
| `DELETE` | `/api/v1/tasks/:id`          | Delete a task                                                    |
| `GET`    | `/api/v1/analytics/overview` | Fetch workspace task metrics, stage breakdown & team count       |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `>= 18.0.0`
- **pnpm** `>= 9.0.0` (or `npm`)

### Environment Variables

Create `.env` inside `apps/server/.env`:

```env
DATABASE_URL=postgresql://neondb_owner:npg_dwtvJCP3U7Ti@ep-late-sun-azh9fdkk.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
BETTER_AUTH_SECRET="6c934aabb5ac4646da469b245e2df18e26744d123d6173659a27e5f0877a9985"
BETTER_AUTH_URL=http://localhost:3000
FRONTEND_URL=["http://localhost:5173"]
```

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/AshutoshDM1/Trello-lite.git
cd Trello-lite

# Install workspace dependencies
pnpm install
```

### Database Migration & Seeding

```bash
# Push database schema to Neon PostgreSQL
pnpm --filter server db:push

# Populate database with demo board, columns, and sample tasks
pnpm --filter server seed
```

### Running the Project

```bash
# Start both backend server (port 3000) and frontend Vite dev server (port 5173) concurrently
pnpm dev
```

- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:3000`
- **Swagger Docs**: `http://localhost:3000/docs`

---

## 🧪 Automated Testing

Backend unit tests are written with **Vitest**:

```bash
# Run backend test suite
pnpm --filter server test
```

### Test Coverage Highlights

- ✅ Task creation with empty title fails with HTTP 400 Bad Request.
- ✅ Task creation with invalid priority or missing columnId fails with HTTP 400 Bad Request.
- ✅ Moving a task updates target `columnId` successfully.
- ✅ Priority filtering queries return correctly sorted tasks.

---

## 🚢 Deployment

- **Backend CI/CD**: Configured via GitHub Actions ([`.github/workflows/deploy.yaml`](file:///.github/workflows/deploy.yaml)) deploying automatically to DigitalOcean VM.
- **Frontend Production Build**:

```bash
pnpm --filter web build
```

---

## 💡 Technical Decisions & Lessons Learned

1. **Express Middleware Order**: Mounted `toNodeHandler(auth)` before `express.json()` to ensure raw stream handling for authentication endpoints without request body stream consumption issues.
2. **Modular Page Architecture**: Organized pages into dedicated folders (`pages/Board`, `pages/Dashboard`) with sub-component isolation (`components/BoardColumn.tsx`, `components/TaskCard.tsx`) for high readability and maintainability.
3. **Tailwind v4 Integration**: Leveraged new Tailwind v4 syntax conventions (`bg-linear-to-br`, CSS variable theme tokens) for modern aesthetic consistency across light and dark themes.
