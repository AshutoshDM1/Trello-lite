# 📖 Swagger / OpenAPI 3.0 API Documentation Guide

This document details the Swagger / OpenAPI 3.0 integration for the **Lead CRM Backend API** (`apps/server`).

---

## 🚀 Overview

The backend uses **Swagger UI** (`swagger-ui-express`) paired with an **OpenAPI 3.0 specification** to provide interactive, visual API documentation. Developers and consumers can inspect, test, and document all backend endpoints directly from a web browser without needing external tools like Postman.

### Key Benefits

- **Interactive Documentation**: Test live API endpoints directly from the browser using the "Try it out" feature.
- **Contract & Schemas**: Standardized JSON data models for `Lead`, `User`, `LeadNote`, and `ErrorResponse`.
- **Validation Overview**: Clear view of required parameters, enum constraints, and status codes (`200`, `201`, `400`, `403`, `409`, `500`).
- **Auth Visuals**: View and simulate session cookies (`better-auth.session_token`) and Bearer headers.

---

## 🌐 Accessing Swagger UI

Start the development server (`dk dev` or `pnpm --filter server dev`) and open either URL in your browser:

- Primary Swagger UI URL: **[`http://localhost:3000/docs`](http://localhost:3000/docs)**
- Alias URL: **[`http://localhost:3000/api-docs`](http://localhost:3000/api-docs)**

The root backend welcome endpoint ([`http://localhost:3000/`](http://localhost:3000/)) also includes a link to the `/docs` endpoint:

```json
{
  "message": "Welcome to Lead CRM Backend API!",
  "timestamp": "2026-07-26T18:57:49.000Z",
  "status": "healthy",
  "docs": "/docs"
}
```

---

## 🛠️ Implementation & Code Architecture

### Files & Configuration

1. **OpenAPI Specification**: [`apps/server/src/docs/swagger.ts`](file:///c:/Users/runak/Coding/Workspace/Lead-CRM/apps/server/src/docs/swagger.ts)
   Contains the OpenAPI 3.0 JSON specification declaring metadata, server URLs, security definitions, component schemas, tags, and path operations.

2. **Express Server Mounting**: [`apps/server/src/index.ts`](file:///c:/Users/runak/Coding/Workspace/Lead-CRM/apps/server/src/index.ts)

   ```typescript
   import swaggerUi from 'swagger-ui-express';
   import { swaggerDocument } from './docs/swagger.js';

   // Interactive Swagger API documentation
   app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
   ```

3. **Dependencies** ([`apps/server/package.json`](file:///c:/Users/runak/Coding/Workspace/Lead-CRM/apps/server/package.json)):
   - `swagger-ui-express`: `^5.0.1` (Renders Swagger UI web application)
   - `@types/swagger-ui-express`: `^4.1.8` (TypeScript type definitions)

---

## 📑 API Endpoints Reference

### 1. Health (`Health`)

| Endpoint | Method | Auth | Description                                   | Status Codes |
| -------- | ------ | ---- | --------------------------------------------- | ------------ |
| `/`      | `GET`  | None | Server status, timestamp, and link to `/docs` | `200 OK`     |

### 2. Public Leads (`Leads (Public)`)

| Endpoint               | Method | Auth | Description                                                                                   | Status Codes                                         |
| ---------------------- | ------ | ---- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `/api/v1/leads/public` | `POST` | None | Public form for prospective clients to submit inquiries. Runs duplicate check on email/phone. | `201 Created`<br>`400 Bad Request`<br>`409 Conflict` |

### 3. Dashboard Leads (`Leads (Dashboard)`)

| Endpoint                   | Method   | Auth     | Description                                                      | Status Codes                                         |
| -------------------------- | -------- | -------- | ---------------------------------------------------------------- | ---------------------------------------------------- |
| `/api/v1/leads`            | `GET`    | Required | Retrieve list of leads with optional `search` & `status` filters | `200 OK`<br>`401 Unauthorized`                       |
| `/api/v1/leads`            | `POST`   | Required | Create a new lead record manually                                | `201 Created`<br>`400 Bad Request`<br>`409 Conflict` |
| `/api/v1/leads/{id}`       | `PATCH`  | Required | Update existing lead status, value, assigned user, or details    | `200 OK`<br>`404 Not Found`                          |
| `/api/v1/leads/{id}`       | `DELETE` | Required | Delete lead record by ID                                         | `200 OK`<br>`404 Not Found`                          |
| `/api/v1/leads/{id}/notes` | `GET`    | Required | Get activity log history and notes for a specific lead           | `200 OK`<br>`404 Not Found`                          |
| `/api/v1/leads/{id}/notes` | `POST`   | Required | Add a new activity note to a lead                                | `201 Created`<br>`400 Bad Request`                   |

### 4. Users Directory & RBAC (`Users & RBAC`)

| Endpoint                  | Method  | Auth             | Description                                    | Status Codes                                   |
| ------------------------- | ------- | ---------------- | ---------------------------------------------- | ---------------------------------------------- |
| `/api/v1/users`           | `GET`   | Required (Admin) | Fetch full user directory                      | `200 OK`<br>`403 Forbidden`                    |
| `/api/v1/users/{id}/role` | `PATCH` | Required (Admin) | Update user role (`admin`, `member`, `viewer`) | `200 OK`<br>`403 Forbidden`<br>`404 Not Found` |

---

## 📦 Data Component Schemas

| Schema                      | Key Fields                                                                                                 | Description                 |
| --------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------- |
| **`Lead`**                  | `id`, `name`, `email`, `phone`, `company`, `source`, `status`, `value`, `assignedTo`, `notes`, `createdAt` | Full lead data structure    |
| **`LeadNote`**              | `id`, `leadId`, `content`, `authorId`, `createdAt`                                                         | Activity log / note object  |
| **`User`**                  | `id`, `name`, `email`, `role` (`admin` \| `member` \| `viewer`), `createdAt`                               | User account structure      |
| **`PublicCreateLeadInput`** | `name` (req), `email` (req), `phone`, `company`, `source`, `notes`                                         | Public form input DTO       |
| **`CreateLeadInput`**       | `name` (req), `email` (req), `status`, `assignedTo`, `value`                                               | Dashboard lead creation DTO |
| **`UpdateLeadInput`**       | `name`, `email`, `phone`, `company`, `source`, `status`, `assignedTo`, `value`, `notes`                    | Partial update DTO          |
| **`UpdateUserRoleInput`**   | `role` (`admin` \| `member` \| `viewer`)                                                                   | Role update DTO             |
| **`ErrorResponse`**         | `message`, `errors`                                                                                        | Standardized error payload  |

---

## 🔒 Security Schemes in Swagger UI

Swagger UI supports testing authenticated endpoints via two schemes defined in `components.securitySchemes`:

1. **`CookieAuth`**:
   - **Type**: API Key in Cookie
   - **Cookie Name**: `better-auth.session_token`
   - **Usage**: Automatically sent when logged in via Better Auth session cookie.

2. **`BearerAuth`**:
   - **Type**: HTTP Bearer Token
   - **Header**: `Authorization: Bearer <token>`
