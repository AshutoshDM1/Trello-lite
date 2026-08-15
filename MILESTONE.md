# TaskFlow — 5-Step AI Development Milestones

## Milestone 1 — Project Foundation & Database

**Goal:** Set up the full-stack project and establish the database layer.

### Tasks

- Set up frontend and backend applications.
- Configure development scripts.
- Set up the relational database.
- Create `Board`, `Column`, and `Task` models/tables.
- Add primary keys and required foreign-key relationships.
- Add required `NOT NULL` constraints.
- Create database migrations/schema.
- Create seed data with:

  - 1 demo board
  - 3 columns: To Do, In Progress, Done
  - Several sample tasks

- Implement the required database queries:

  - Tasks per column
  - Tasks by priority, newest first

### Deliverable

A fresh clone can start successfully and initialize a populated database.

---

## Milestone 2 — Backend API & Validation

**Goal:** Build the backend API required to manage tasks.

### Tasks

Implement APIs for:

- Get board with columns and tasks
- Create task
- Update task
- Delete task
- Move task between columns
- Filter tasks by priority

### Validation

- Reject tasks with an empty title.
- Validate priority values.
- Validate referenced columns.
- Return appropriate HTTP status codes.

### Error Handling

- Handle database failures.
- Handle invalid requests.
- Return structured API errors.
- Ensure the frontend can display meaningful errors.

### Deliverable

The complete task-management functionality should be usable through the backend API alone.

---

## Milestone 3 — Frontend Task Board

**Goal:** Build the functional TaskFlow UI.

### Tasks

- Create the board layout.
- Display columns.
- Display tasks inside their respective columns.
- Create task form/modal.
- Edit task functionality.
- Delete task functionality.
- Move task between columns.
- Add priority indicators.
- Display task creation date.
- Add loading states.
- Add empty states.
- Add API error states.

### Deliverable

A user can manage tasks entirely through the frontend, with all operations connected to the real backend.

---

## Milestone 4 — Filtering, Testing & Reliability

**Goal:** Make the application robust and assignment-ready.

### Tasks

#### Filtering

- Add priority filter:

  - All
  - Low
  - Medium
  - High

- Ensure filtering happens correctly without breaking task operations.

#### Backend Tests

Implement at least:

1. Creating a task without a title fails.
2. Moving a task updates its column correctly.
3. A database query returns the expected results using seed data.

#### Reliability

- Handle failed API requests gracefully.
- Verify data persists after page reload.
- Verify invalid input cannot bypass backend validation.
- Remove debugging `console.log`s.
- Clean up unused/commented-out code.

### Deliverable

The application should be stable, tested, and satisfy all mandatory requirements.

---

## Milestone 5 — Polish, Documentation & Deployment

**Goal:** Prepare the project for final submission.

### Tasks

#### UI Polish

- Improve spacing and layout.
- Ensure the board is easy to understand.
- Make forms and controls intuitive.
- Add basic responsive behavior.
- Avoid unnecessary design complexity.

#### README

Document:

- Project overview
- Tech stack
- Architecture
- Features
- Database schema
- Setup instructions
- Environment variables
- How to run frontend/backend
- Seed instructions
- Testing instructions
- Technical decisions and assumptions
- What could be improved with more time
- Approximate development time
- One interesting thing learned during development

#### Deployment

- Deploy the application if possible.
- Verify the production build.
- Verify database persistence.
- Add the live URL to the README.

### Optional Stretch Goal

Only after everything above works, implement **one**:

- Drag-and-drop
- Task title search
- Task count per column

### Deliverable

A clean, documented, tested, and optionally deployed TaskFlow project ready for submission.
