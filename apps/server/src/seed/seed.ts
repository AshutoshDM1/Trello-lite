import 'dotenv/config';
import { eq } from 'drizzle-orm';
import db from '../utils/db.js';
import { boards, columns, tasks } from '../db/schema.js';

export async function seedDatabase() {
  console.log('🌱 Starting database seed...');

  try {
    const demoBoardId = 'board_demo_1';

    // 1. Ensure Demo Board exists
    const [existingBoard] = await db.select().from(boards).where(eq(boards.id, demoBoardId));

    if (!existingBoard) {
      console.log('Creating demo board...');
      await db.insert(boards).values({
        id: demoBoardId,
        name: 'TaskFlow Workspace Board',
      });
    }

    // 2. Ensure Columns exist (To Do, In Progress, Done)
    const defaultColumns = [
      { id: 'col_todo', name: 'To Do', boardId: demoBoardId, position: 0 },
      { id: 'col_in_progress', name: 'In Progress', boardId: demoBoardId, position: 1 },
      { id: 'col_done', name: 'Done', boardId: demoBoardId, position: 2 },
    ];

    for (const col of defaultColumns) {
      const [existingCol] = await db.select().from(columns).where(eq(columns.id, col.id));

      if (!existingCol) {
        console.log(`Creating column: ${col.name}`);
        await db.insert(columns).values(col);
      }
    }

    // 3. Ensure Sample Tasks exist
    const defaultTasks = [
      {
        id: 'task_sample_1',
        title: 'Design TaskFlow Database Schema',
        description: 'Set up tables for boards, columns, tasks and foreign key relations.',
        columnId: 'col_done',
        priority: 'High',
      },
      {
        id: 'task_sample_2',
        title: 'Implement REST API Endpoints',
        description: 'Build backend routes for task creation, update, move and deletion.',
        columnId: 'col_in_progress',
        priority: 'High',
      },
      {
        id: 'task_sample_3',
        title: 'Integrate Zod Input Validation',
        description: 'Validate request bodies to reject empty titles and invalid priorities.',
        columnId: 'col_in_progress',
        priority: 'Medium',
      },
      {
        id: 'task_sample_4',
        title: 'Build React Task Board UI',
        description: 'Display columns and cards with responsive drag/move support.',
        columnId: 'col_todo',
        priority: 'Medium',
      },
      {
        id: 'task_sample_5',
        title: 'Add Unit & Integration Tests',
        description: 'Write test cases verifying task validation and column transitions.',
        columnId: 'col_todo',
        priority: 'Low',
      },
    ];

    for (const task of defaultTasks) {
      const [existingTask] = await db.select().from(tasks).where(eq(tasks.id, task.id));

      if (!existingTask) {
        console.log(`Creating sample task: ${task.title}`);
        await db.insert(tasks).values(task);
      }
    }

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Database seed error:', error);
    process.exit(1);
  }
}

// Execute script if run directly
if (process.argv[1]?.includes('seed.ts')) {
  seedDatabase();
}
