import 'dotenv/config';
import db from '../utils/db.js';
import { boards, columns, tasks } from './schema.js';

export async function seed() {
  console.log('🌱 Seeding database...');

  // Clean existing task management data
  await db.delete(tasks);
  await db.delete(columns);
  await db.delete(boards);

  const demoBoardId = 'board-demo';

  // 1. Insert 1 demo board
  await db.insert(boards).values({
    id: demoBoardId,
    name: 'TaskFlow Demo',
  });

  // 2. Insert 3 columns: To Do, In Progress, Done
  const todoColId = 'col-todo';
  const inProgressColId = 'col-in-progress';
  const doneColId = 'col-done';

  await db.insert(columns).values([
    {
      id: todoColId,
      name: 'To Do',
      boardId: demoBoardId,
      position: 0,
    },
    {
      id: inProgressColId,
      name: 'In Progress',
      boardId: demoBoardId,
      position: 1,
    },
    {
      id: doneColId,
      name: 'Done',
      boardId: demoBoardId,
      position: 2,
    },
  ]);

  // 3. Insert sample tasks
  const now = Date.now();
  await db.insert(tasks).values([
    {
      id: 'task-1',
      title: 'Initialize repository',
      description: 'Initial commit and monorepo configuration',
      columnId: doneColId,
      priority: 'Low',
      createdAt: new Date(now - 3600000 * 3),
    },
    {
      id: 'task-2',
      title: 'Setup project',
      description: 'Configure TypeScript, ESLint, and package scripts',
      columnId: todoColId,
      priority: 'Medium',
      createdAt: new Date(now - 3600000 * 2),
    },
    {
      id: 'task-3',
      title: 'Design database',
      description: 'Define relational schema, foreign key constraints, and migrations',
      columnId: todoColId,
      priority: 'High',
      createdAt: new Date(now - 3600000 * 1),
    },
    {
      id: 'task-4',
      title: 'Build API',
      description: 'Develop REST endpoints for tasks and columns',
      columnId: inProgressColId,
      priority: 'High',
      createdAt: new Date(now),
    },
  ]);

  console.log('✅ Database seeded successfully!');
}

if (process.argv[1]?.includes('seed')) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Seeding failed:', err);
      process.exit(1);
    });
}
