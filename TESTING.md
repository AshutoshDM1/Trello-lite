# 🧪 Lead CRM Testing Guide & Test Suite Documentation

This document explains the testing architecture, test framework setup, commands to run tests, and a detailed breakdown of all unit and integration tests written in the backend (`apps/server`).

---

## 🛠️ Testing Stack & Architecture

- **Test Runner**: [Vitest](https://vitest.dev/) (Fast ESM-native test runner)
- **Assertion Library**: Vitest Built-in `expect`
- **Mocking**: Vitest `vi.fn()`, `vi.mock()`, and modular dependency isolation
- **Target App**: `apps/server` Express application

Tests are co-located in `__tests__` directories alongside controllers, validation schemas, and utility functions for clear modularity.

---

## 🚀 How to Run Tests

From the **`apps/server`** directory:

```bash
# Run all unit tests once
npx vitest run

# Run unit tests in interactive watch mode
npx vitest

# Alternative via npm / dk helper
dk test
```

From the **workspace root** (`Lead-CRM`):

```bash
pnpm --filter server test
```

---

## 📑 Comprehensive Breakdown of Written Tests

Total Test Files: **4** | Total Tests: **12** | Passing: **100%**

```
 ✓ src/utils/__tests__/asyncHandler.test.ts (2 tests)
 ✓ src/controllers/Lead/__tests__/lead.validation.test.ts (6 tests)
 ✓ src/controllers/Lead/__tests__/lead.controller.test.ts (2 tests)
 ✓ src/controllers/User/__tests__/user.controller.test.ts (2 tests)
```

---

### 1. `asyncHandler` Utility Tests

**File**: [`apps/server/src/utils/__tests__/asyncHandler.test.ts`](file:///c:/Users/runak/Coding/Workspace/Lead-CRM/apps/server/src/utils/__tests__/asyncHandler.test.ts)

Tests the central higher-order async wrapper function that catches unhandled controller errors and prevents server crashes.

| Test Case                                                                      | Description & Assertions                                                                                                                                                                            |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `should execute controller handler successfully`                               | Passes `req` and `res` objects to the wrapped function and verifies successful execution without errors.                                                                                            |
| `should catch errors thrown by controller handler and respond with 500 status` | Simulates an asynchronous database failure (throws `Error`). Asserts that the wrapper catches the error, logs it, sets `res.status(500)`, and responds with `{ message: "Internal server error" }`. |

---

### 2. Lead Validation Schemas Tests

**File**: [`apps/server/src/controllers/Lead/__tests__/lead.validation.test.ts`](file:///c:/Users/runak/Coding/Workspace/Lead-CRM/apps/server/src/controllers/Lead/__tests__/lead.validation.test.ts)

Validates Zod input validation schemas enforced on API requests before data hits controllers or database queries.

#### A. `publicCreateLeadSchema`

| Test Case                                   | Description & Assertions                                                                                                                             |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `should validate a valid public lead input` | Tests full payload (`name`, `email`, `phone`, `company`, `source`, `notes`). Asserts `safeParse` returns `success: true` and parses email correctly. |
| `should fail when name or email is missing` | Tests missing required `name` field. Asserts `safeParse` returns `success: false`.                                                                   |
| `should fail when email format is invalid`  | Passes an invalid string `'invalid-email-address'`. Asserts schema validation fails (`success: false`).                                              |

#### B. `createLeadSchema`

| Test Case                                         | Description & Assertions                                                                                         |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `should validate dashboard lead creation payload` | Tests valid creation payload with status `'qualified'`. Asserts `success: true`.                                 |
| `should fail on invalid lead status string`       | Passes an unsupported status string `'non_existent_status'`. Asserts schema validation fails (`success: false`). |

#### C. `updateLeadSchema`

| Test Case                                                | Description & Assertions                                                                                                                      |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `should allow partial updates for lead status and notes` | Tests partial update payload containing only `status: 'won'` and `notes`. Asserts schema validates partial updates cleanly (`success: true`). |

---

### 3. Lead Controller & Duplicate Detection Tests

**File**: [`apps/server/src/controllers/Lead/__tests__/lead.controller.test.ts`](file:///c:/Users/runak/Coding/Workspace/Lead-CRM/apps/server/src/controllers/Lead/__tests__/lead.controller.test.ts)

Tests public lead capture controller logic, database insertion mocks, and duplicate lead detection rules.

| Test Case                                                               | Description & Assertions                                                                                                                                                                                         |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `should return 409 Conflict when duplicate email or phone is submitted` | Mocks Drizzle DB `select` to return an existing lead matching the submitted email/phone. Calls `publicCreateLead`. Asserts HTTP status `409 Conflict` and verifies response message contains `'already exists'`. |
| `should successfully capture lead when input is non-duplicate`          | Mocks Drizzle DB `select` returning no duplicates, and DB `insert` returning a newly created lead. Asserts HTTP status `201 Created` and verifies response message `'Lead captured successfully'`.               |

---

### 4. User Controller & RBAC Permissions Tests

**File**: [`apps/server/src/controllers/User/__tests__/user.controller.test.ts`](file:///c:/Users/runak/Coding/Workspace/Lead-CRM/apps/server/src/controllers/User/__tests__/user.controller.test.ts)

Tests User Directory endpoints and Role-Based Access Control (RBAC) authorization checks.

| Test Case                                                | Description & Assertions                                                                                                                                                                                                  |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `should deny non-admin member access with 403 Forbidden` | Mocks Better Auth session returning a non-admin user (`role: 'member'`). Calls `getAllUsers`. Asserts HTTP status `403 Forbidden` and message containing `'Forbidden'`.                                                   |
| `should allow admin user to fetch full users list`       | Mocks Better Auth session returning an admin user (`role: 'admin'`) and Drizzle DB user directory select. Calls `getAllUsers`. Asserts HTTP status `200 OK` and verifies user array containing admin records is returned. |

---

## 📌 Summary Checklist

- [x] **Unit Testing Setup**: Vitest configured with TypeScript & ESM support.
- [x] **Async Error Safety**: Automated 500 fallback error handling tested.
- [x] **Input Validation**: Zod schemas for lead creation and updates verified.
- [x] **Duplicate Detection**: 409 Conflict logic tested for public lead submission form.
- [x] **RBAC Authorization**: Admin vs Member permissions enforced and tested.
