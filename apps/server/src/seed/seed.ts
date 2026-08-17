import 'dotenv/config';
import crypto from 'crypto';
import db from '../utils/db.js';
import { boards, columns, tasks } from '../db/schema.js';

export async function seedDatabase() {
  console.log('🌱 Starting database seed with UUIDs and 2 boards...');

  try {
    // 1. Clean existing task management tables
    await db.delete(tasks);
    await db.delete(columns);
    await db.delete(boards);

    const now = Date.now();

    // ==========================================
    // Board 1: "Sprint 1: Core Platform" (4 Tasks)
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
      { id: b1TodoId, name: 'To Do', boardId: board1Id, position: 0 },
      { id: b1InProgressId, name: 'In Progress', boardId: board1Id, position: 1 },
      { id: b1DoneId, name: 'Done', boardId: board1Id, position: 2 },
    ]);

    await db.insert(tasks).values([
      {
        id: crypto.randomUUID(),
        title: 'Design Database Schema',
        description: 'Set up tables for boards, columns, and tasks with foreign keys.',
        columnId: b1DoneId,
        priority: 'High',
        createdAt: new Date(now - 3600000 * 4),
      },
      {
        id: crypto.randomUUID(),
        title: 'Build REST CRUD API',
        description: 'Develop endpoints for task creation, update, move and deletion.',
        columnId: b1InProgressId,
        priority: 'High',
        createdAt: new Date(now - 3600000 * 3),
      },
      {
        id: crypto.randomUUID(),
        title: 'Integrate Zod Input Validation',
        description: 'Validate request bodies to reject empty titles and invalid priorities.',
        columnId: b1TodoId,
        priority: 'Medium',
        createdAt: new Date(now - 3600000 * 2),
      },
      {
        id: crypto.randomUUID(),
        title: 'Configure CORS & Environment Setup',
        description: 'Configure cross-origin resource sharing and environment credentials.',
        columnId: b1TodoId,
        priority: 'Low',
        createdAt: new Date(now - 3600000 * 1),
      },
    ]);

    // ==========================================
    // Board 2: "Sprint 2: Growth & Analytics" (6 Tasks)
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
      { id: b2TodoId, name: 'To Do', boardId: board2Id, position: 0 },
      { id: b2InProgressId, name: 'In Progress', boardId: board2Id, position: 1 },
      { id: b2DoneId, name: 'Done', boardId: board2Id, position: 2 },
    ]);

    await db.insert(tasks).values([
      {
        id: crypto.randomUUID(),
        title: 'Design Analytics Dashboard UI',
        description: 'Create KPI metric cards and stage distribution visual charts.',
        columnId: b2DoneId,
        priority: 'Medium',
        createdAt: new Date(now - 3600000 * 6),
      },
      {
        id: crypto.randomUUID(),
        title: 'Implement 9-Bar Pipeline Matrix',
        description: 'Clustered bar visualization across To Do, In Progress, and Done stages.',
        columnId: b2DoneId,
        priority: 'High',
        createdAt: new Date(now - 3600000 * 5),
      },
      {
        id: crypto.randomUUID(),
        title: 'Add Board Switcher Dialog Modal',
        description: 'Allow seamless switching across workspace pipelines in 1-click modal.',
        columnId: b2InProgressId,
        priority: 'Medium',
        createdAt: new Date(now - 3600000 * 4),
      },
      {
        id: crypto.randomUUID(),
        title: 'Optimize Query Performance',
        description: 'Add composite indexes on boardId, columnId, and priority fields.',
        columnId: b2InProgressId,
        priority: 'Low',
        createdAt: new Date(now - 3600000 * 3),
      },
      {
        id: crypto.randomUUID(),
        title: 'Add Activity Audit Logging',
        description: 'Record timestamped events when cards transition across stages.',
        columnId: b2TodoId,
        priority: 'High',
        createdAt: new Date(now - 3600000 * 2),
      },
      {
        id: crypto.randomUUID(),
        title: 'Export Board Reports to CSV',
        description: 'Generate formatted spreadsheet export of workspace tasks.',
        columnId: b2TodoId,
        priority: 'Low',
        createdAt: new Date(now - 3600000 * 1),
      },
    ]);

    console.log('✅ Database seeding completed: 2 boards (4 tasks & 6 tasks) with UUIDs!');
  } catch (error) {
    console.error('❌ Database seed error:', error);
    process.exit(1);
  }
}

// Execute script if run directly
if (process.argv[1]?.includes('seed.ts')) {
  seedDatabase();
}
