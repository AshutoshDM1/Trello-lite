# 🎯 Lead CRM Application

Welcome to **Lead CRM**! A high-performance, modern Lead & Customer Relationship Management platform built with a full-stack monorepo architecture. Lead CRM empowers businesses to capture, track, manage, and convert prospective leads into clients with real-time pipeline management, automated duplicate detection, activity notes, and role-based access control.

<p align="left">
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62B" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express 5" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black" alt="Drizzle ORM" />
  <img src="https://img.shields.io/badge/Better_Auth-FF4500?style=for-the-badge&logo=auth0&logoColor=white" alt="Better Auth" />
  <img src="https://img.shields.io/badge/Swagger_OpenAPI-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger OpenAPI" />
  <img src="https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" />
  <img src="https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm" />
</p>

---

## 🛠️ 1. Tech Stack

### 💻 Frontend (`apps/web`)

- ⚛️ **Framework**: React 19 (powered by Vite)
- 🎨 **Styling**: Tailwind CSS v4 & Shadcn UI (vanilla HSL design system, micro-animations)
- 🛣️ **Routing**: React Router v7
- 🔄 **State Management**: TanStack React Query v5 & Zustand
- 🌐 **HTTP Client**: Axios
- 🔒 **Authentication**: Better Auth React Client (Google Social SSO)

### ⚙️ Backend (`apps/server`)

- 🚀 **Framework**: Node.js & Express 5
- 💾 **Database Layer**: Neon Serverless PostgreSQL with Drizzle ORM
- 🛡️ **Authentication**: Better Auth (Middleware & session cookies)
- 📐 **Validation**: Zod schema validation
- 📖 **API Documentation**: Swagger UI Express (`/docs` & `/api-docs`)
- 🧪 **Testing**: Vitest unit & integration test runner

---

## 🚀 2. Getting Started

### 1. Install Workspace Dependencies

Run the command below from the monorepo root directory:

```bash
pnpm install
```

### 2. Environment Variables Setup

Create `.env` files in both `apps/web` and `apps/server`:

#### Frontend Configuration (`apps/web/.env`)

```env
VITE_BACKEND_URL=http://localhost:3000
```

#### Backend Configuration (`apps/server/.env`)

```env
DATABASE_URL=postgresql://user:pass@host/db
BETTER_AUTH_SECRET=your_random_auth_secret_here
BETTER_AUTH_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 3. Database Push (Drizzle ORM)

Sync your PostgreSQL schema with Neon database:

```bash
cd apps/server && pnpm drizzle-kit push
```

### 4. Run Development Servers

Start both backend (`apps/server`) and frontend (`apps/web`) concurrently:

```bash
# Using root pnpm script
pnpm dev

# Or using dk CLI tool
dk dev
```

### Local Development

- **Frontend Application**: [http://localhost:5173](http://localhost:5173)
- **Backend API Server**: [http://localhost:3000](http://localhost:3000)
- **Interactive Swagger API Docs**: [http://localhost:3000/docs](http://localhost:3000/docs)

### Production Deployment

- **Frontend Application**: [https://lead-erp.elitedev.space](https://lead-erp.elitedev.space)
- **Backend API Server**: [https://api-lead-erp.elitedev.space](https://api-lead-erp.elitedev.space)
- **Interactive Swagger API Docs**: [https://api-lead-erp.elitedev.space/docs](https://api-lead-erp.elitedev.space/docs)

---

## 🧪 3. Running Unit Tests

Backend test suites are powered by **Vitest**.

```bash
# Run tests from backend package
cd apps/server && npx vitest run

# Run tests from workspace root
pnpm --filter server test
```

> 📘 For a detailed breakdown of all test suites, assertions, and test cases, read **[TESTING.md](TESTING.md)**.

---

## 📖 4. Interactive Swagger API Documentation

Backend endpoints are documented using OpenAPI 3.0 specs and served visually at:
👉 **[http://localhost:3000/docs](http://localhost:3000/docs)** (or `/api-docs`).

> 📘 For complete API specifications, request/response models, and schema references, read **[SWAGGER.md](SWAGGER.md)**.

---

## ✨ 5. Key Features

- 📥 **Public Lead Capture Form**: Public submission endpoint (`POST /api/v1/leads/public`) for prospective clients.
- ⚡ **Automated Duplicate Detection**: Prevents duplicate leads by checking email or phone number in database records (`409 Conflict`).
- 📊 **Pipeline Stage Tracking**: Filter and update lead statuses across `new`, `contacted`, `qualified`, `proposal`, `won`, and `lost`.
- 📝 **Activity History & Notes**: Timestamped lead activity logs and notes for tracking communications.
- 🛡️ **User Directory & RBAC Permissions**: Admin user management for assigning team roles (`admin`, `member`, `viewer`).
- 🔑 **Google SSO & Session Auth**: Authentication powered by Better Auth.
- 📖 **Interactive Swagger UI**: Interactive API documentation available at `/docs`.
- 🧪 **100% Passing Test Suite**: Fully tested backend validation schemas, controllers, and error handling.

---

## 📚 6. Documentation Index

| Document                          | Description                                                          |
| --------------------------------- | -------------------------------------------------------------------- |
| 🧪 **[TESTING.md](TESTING.md)**   | Full guide to test architecture and individual test suite breakdowns |
| 📖 **[SWAGGER.md](SWAGGER.md)**   | Swagger / OpenAPI 3.0 API documentation setup & endpoint matrix      |
| 📋 **[FEATURES.md](FEATURES.md)** | Platform features list, implementation status, and project roadmap   |
