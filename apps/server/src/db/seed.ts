import 'dotenv/config';
import crypto from 'crypto';
import db from '../utils/db.js';
import { boards, columns, tasks } from './schema.js';

export async function seed() {
  console.log('🌱 Seeding database with UUIDs and two boards...');

  // Clean existing task management data
  await db.delete(tasks);
  await db.delete(columns);
  await db.delete(boards);

  const now = Date.now();

  // ==========================================
  // 1. Board 1 (Sprint 1: Core Platform) - 4 Tasks
  // ==========================================
  const board1Id = crypto.randomUUID();
  await db.insert(boards).values({
    id: board1Id,
    name: 'Sprint 1: Core Platform',
  });

  const b1TodoId = crypto.randomUUID();
  const b1InProgressId = crypto.randomUUID();
  const b1DoneId = crypto.randomUUID();

  await db.insert(columns).values([
    {
      id: b1TodoId,
      name: 'To Do',
      boardId: board1Id,
      position: 0,
    },
    {
      id: b1InProgressId,
      name: 'In Progress',
      boardId: board1Id,
      position: 1,
    },
    {
      id: b1DoneId,
      name: 'Done',
      boardId: board1Id,
      position: 2,
    },
  ]);

  await db.insert(tasks).values([
    {
      id: crypto.randomUUID(),
      title: 'Initialize Monorepo Structure',
      description: 'Setup pnpm workspace and root configuration',
      columnId: b1DoneId,
      priority: 'Low',
      createdAt: new Date(now - 3600000 * 6),
    },
    {
      id: crypto.randomUUID(),
      title: 'Configure PostgreSQL & Drizzle ORM',
      description: 'Setup database connection pool, migrations, and schema definitions',
      columnId: b1DoneId,
      priority: 'High',
      createdAt: new Date(now - 3600000 * 5),
    },
    {
      id: crypto.randomUUID(),
      title: 'Implement REST CRUD API Endpoints',
      description: 'Develop controllers and Zod validation schemas for boards and tasks',
      columnId: b1InProgressId,
      priority: 'High',
      createdAt: new Date(now - 3600000 * 4),
    },
    {
      id: crypto.randomUUID(),
      title: 'Setup Authentication Middleware',
      description: 'Integrate session management and RBAC access guards',
      columnId: b1TodoId,
      priority: 'Medium',
      createdAt: new Date(now - 3600000 * 3),
    },
  ]);

  // ==========================================
  // 2. Board 2 (Sprint 2: Growth & Analytics) - 6 Tasks
  // ==========================================
  const board2Id = crypto.randomUUID();
  await db.insert(boards).values({
    id: board2Id,
    name: 'Sprint 2: Growth & Analytics',
  });

  const b2TodoId = crypto.randomUUID();
  const b2InProgressId = crypto.randomUUID();
  const b2DoneId = crypto.randomUUID();

  await db.insert(columns).values([
    {
      id: b2TodoId,
      name: 'To Do',
      boardId: board2Id,
      position: 0,
    },
    {
      id: b2InProgressId,
      name: 'In Progress',
      boardId: board2Id,
      position: 1,
    },
    {
      id: b2DoneId,
      name: 'Done',
      boardId: board2Id,
      position: 2,
    },
  ]);

  await db.insert(tasks).values([
    {
      id: crypto.randomUUID(),
      title: 'Design Analytics Dashboard UI',
      description: 'Create KPI metric cards and stage distribution visual charts',
      columnId: b2DoneId,
      priority: 'Medium',
      createdAt: new Date(now - 3600000 * 6),
    },
    {
      id: crypto.randomUUID(),
      title: 'Implement 9-Bar Pipeline Matrix',
      description: 'Clustered bar visualization across To Do, In Progress, and Done stages',
      columnId: b2DoneId,
      priority: 'High',
      createdAt: new Date(now - 3600000 * 5),
    },
    {
      id: crypto.randomUUID(),
      title: 'Add Board Switcher Modal',
      description: 'Allow seamless switching across workspace pipelines in 1-click dialog',
      columnId: b2InProgressId,
      priority: 'Medium',
      createdAt: new Date(now - 3600000 * 4),
    },
    {
      id: crypto.randomUUID(),
      title: 'Optimize Database Query Indexes',
      description: 'Add composite indexes on boardId, columnId, and priority fields',
      columnId: b2InProgressId,
      priority: 'Low',
      createdAt: new Date(now - 3600000 * 3),
    },
    {
      id: crypto.randomUUID(),
      title: 'Add Activity Audit Logging',
      description: 'Record timestamped events when cards transition across stages',
      columnId: b2TodoId,
      priority: 'High',
      createdAt: new Date(now - 3600000 * 2),
    },
    {
      id: crypto.randomUUID(),
      title: 'Export Board Reports to CSV',
      description: 'Generate formatted spreadsheet export of workspace tasks',
      columnId: b2TodoId,
      priority: 'Low',
      createdAt: new Date(now - 3600000 * 1),
    },
  ]);

  console.log('✅ Database seeded successfully with 2 boards (4 tasks and 6 tasks)!');
}

if (process.argv[1]?.includes('seed')) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Seeding failed:', err);
      process.exit(1);
    });
}
