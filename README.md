# 🎯 Trello Lite Application

Welcome to **Trello Lite**! A high-performance, modern project & workspace management platform built with a full-stack monorepo architecture. Trello Lite provides a clean starter setup featuring full-stack authentication, database configuration, user role-based access control, and a responsive frontend dashboard.

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
- 🎨 **Styling**: Tailwind CSS v4 & Shadcn UI
- 🛣️ **Routing**: React Router v7
- 🔄 **State Management**: TanStack React Query v5 & Zustand
- 🌐 **HTTP Client**: Axios
- 🔒 **Authentication**: Better Auth React Client (Email/Password & Google Social SSO)

### ⚙️ Backend (`apps/server`)

- 🚀 **Framework**: Node.js & Express 5
- 💾 **Database Layer**: Neon Serverless PostgreSQL with Drizzle ORM
- 🛡️ **Authentication**: Better Auth (Middleware & session cookies)
- 📐 **Validation**: Zod schema validation
- 📖 **API Documentation**: Swagger UI Express (`/docs` & `/api-docs`)
- 🧪 **Testing**: Vitest test runner

---

## 🚀 2. Getting Started

### Installation

```bash
# Install dependencies across all monorepo packages
pnpm install

# Start development servers for backend and frontend concurrently
pnpm dev
```
