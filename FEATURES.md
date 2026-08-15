# TaskFlow — Feature Requirements

A lightweight task board for small teams, similar to a simplified Trello.

## 🎯 Goal

Build a full-stack task management board where users can create, edit, delete, filter, and move tasks between columns. All task data must persist through a real backend and relational database.

---

## 🧩 Core Features

### 1. Board

The application should display a board containing multiple columns.

Default columns:

- **To Do**
- **In Progress**
- **Done**

Each column contains its associated tasks.

---

### 2. Task

Each task should contain:

| Field         | Required | Description                          |
| ------------- | -------- | ------------------------------------ |
| `id`          | Yes      | Unique task identifier               |
| `title`       | Yes      | Task title                           |
| `description` | No       | Optional task details                |
| `columnId`    | Yes      | Column the task currently belongs to |
| `priority`    | No       | `Low`, `Medium`, or `High`           |
| `createdAt`   | Yes      | Task creation timestamp              |

---

## ✨ User Operations

### Create Task

Users should be able to create a task with:

- Title — **required**
- Description — optional
- Priority — optional

Empty titles must be rejected by **both frontend and backend validation**.

---

### Edit Task

Users should be able to update:

- Title
- Description
- Priority

---

### Delete Task

Users should be able to permanently delete an existing task.

---

### Move Task

Users should be able to move a task between columns.

For the core implementation, either of these is acceptable:

- Dropdown/select control
- Move buttons

**Stretch:** Implement drag-and-drop.

A reliable dropdown is preferred over a broken drag-and-drop implementation.

---

### Filter Tasks

Users must be able to filter visible tasks by priority:

- All
- Low
- Medium
- High

**Stretch:** Add text search that filters tasks by title.

---

## 🗄️ Database Requirements

Use a real relational database.

SQLite is completely acceptable.

### Relationships

```text
Board
  │
  └── Columns
        │
        └── Tasks
```

Required relationships:

```text
Column.boardId → Board.id
Task.columnId → Column.id
```

### Database Constraints

- Every table must have a primary key.
- Required fields must use `NOT NULL`.
- `Task → Column` must use a foreign key.
- `Column → Board` must use a foreign key.
- Task title must not be nullable.

The database schema should be included in the repository through either:

- `schema.sql`
- ORM migration files
- SQL `CREATE TABLE` statements in the README

---

## 🔎 Required Database Queries

The implementation must contain at least **two meaningful database queries** that are more than simply fetching every row.

### Query 1 — Tasks per Column

Return the number of tasks in each column for a board.

Example:

```sql
SELECT
    c.id,
    c.name,
    COUNT(t.id) AS task_count
FROM columns c
LEFT JOIN tasks t ON t.column_id = c.id
WHERE c.board_id = ?
GROUP BY c.id, c.name;
```

### Query 2 — Tasks by Priority

Return tasks matching a priority, newest first.

Example:

```sql
SELECT *
FROM tasks
WHERE priority = ?
ORDER BY created_at DESC;
```

The actual SQL/query-builder implementation should be visible in the codebase.

---

## 🌱 Seed Data

Provide seed data so that a fresh database isn't empty.

Example:

```text
Board: TaskFlow Demo

To Do
├── Setup project
├── Design database

In Progress
└── Build API

Done
└── Initialize repository
```

---

## ⚠️ Validation & Error Handling

### Backend Validation

The backend must reject:

```json
{
  "title": ""
}
```

A task cannot be created without a valid title.

### Frontend Error Handling

If an API/database request fails:

- Show a useful error message.
- Keep the application usable.
- Do not show a blank screen.
- Do not expose raw backend errors to the user.

---

## 🧪 Required Tests

At minimum, implement these backend tests:

### Test 1 — Empty Title

```text
Creating a task without a title → request fails
```

### Test 2 — Move Task

```text
Moving a task → task's column/status is updated correctly
```

### Test 3 — Database Query

Test one of the required database queries using known seed data.

Example:

```text
Tasks-per-column query
→ returns the expected task counts
```

---

## 🚫 Out of Scope

Do **not** spend time implementing:

- User authentication/login
- Multiple users
- Teams/permissions
- Real-time updates
- File uploads
- Advanced UI/visual polish

The assignment explicitly prioritizes functionality and code quality over visual design.

---

## 🚀 Stretch Goals

Only implement these after all core requirements are working.

Pick **at most one**:

- [ ] Drag-and-drop task movement
- [ ] Task title search
- [ ] Task count displayed in each column header

A smaller, reliable implementation is better than a feature-heavy broken one.

---

## 🌐 Deployment

Deployment is optional but **strongly recommended**.

A live deployment can be hosted using services such as:

- Render
- Railway
- Vercel
- Fly.io
- Any suitable hosting provider

The evaluator should be able to open the deployed application and test the core functionality directly.

---

## 📁 Expected Application Flow

```text
User
 │
 ▼
Frontend
 │
 │ HTTP/API
 ▼
Backend
 │
 ▼
Relational Database
```

Example flow for creating a task:

```text
Create Task Form
      ↓
Frontend Validation
      ↓
POST /tasks
      ↓
Backend Validation
      ↓
Database INSERT
      ↓
Return Created Task
      ↓
Update UI
```

Example flow for moving a task:

```text
Move Task
    ↓
PATCH /tasks/:id
    ↓
Update column_id
    ↓
Database
    ↓
Return Updated Task
    ↓
Update Board UI
```

---

## ✅ Feature Checklist

### Board

- [ ] Display board
- [ ] Display columns
- [ ] Display tasks inside columns

### Tasks

- [ ] Create task
- [ ] Edit task
- [ ] Delete task
- [ ] Move task between columns
- [ ] Task title validation
- [ ] Priority support
- [ ] Created date

### Filtering

- [ ] Filter by Low priority
- [ ] Filter by Medium priority
- [ ] Filter by High priority
- [ ] Optional: title search

### Backend

- [ ] Real API
- [ ] Database persistence
- [ ] Backend validation
- [ ] Error handling

### Database

- [ ] Board table
- [ ] Column table
- [ ] Task table
- [ ] Primary keys
- [ ] Foreign keys
- [ ] Required `NOT NULL` constraints
- [ ] Seed data
- [ ] Task-count-per-column query
- [ ] Priority/newest-first query

### Tests

- [ ] Empty-title test
- [ ] Move-task test
- [ ] Database query test

### Submission

- [ ] Public/invite-accessible Git repository
- [ ] README with setup instructions
- [ ] README with technical decisions/assumptions
- [ ] README with what could be improved
- [ ] README with approximate development time
- [ ] Optional learning/interesting discovery
- [ ] Optional live deployment

## ⭐ Priority

Implementation priority should be:

```text
1. Database + backend
2. CRUD operations
3. Task movement
4. Validation + error handling
5. Filtering
6. Tests
7. Clean UI
8. Stretch goal
9. Deployment
```

**Core functionality comes first. Do not sacrifice working CRUD, persistence, validation, or tests for visual polish or stretch features.**
