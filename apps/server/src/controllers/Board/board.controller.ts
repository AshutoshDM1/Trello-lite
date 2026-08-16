import type { Request, Response } from 'express';
import { eq, asc, desc, and, type SQL } from 'drizzle-orm';
import db from '../../utils/db.js';
import { boards, columns, tasks } from '../../db/schema.js';
import { priorityQuerySchema } from '../Task/task.validation.js';

/**
 * GET /api/v1/boards
 * List all boards or default board
 */
export async function getBoards(_req: Request, res: Response): Promise<void> {
  try {
    const boardsList = await db.select().from(boards).orderBy(asc(boards.createdAt));

    res.status(200).json({
      message: 'Boards retrieved successfully',
      data: boardsList,
    });
  } catch (error: any) {
    console.error('Error fetching boards:', error);
    res.status(500).json({
      message: 'Failed to fetch boards',
      error: error?.message || 'Internal Server Error',
    });
  }
}

/**
 * GET /api/v1/boards/:id
 * Get board details with nested columns and tasks
 * Supports ?priority=Low|Medium|High query filter
 */
export async function getBoardById(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({ message: 'Board ID is required' });
      return;
    }

    const queryResult = priorityQuerySchema.safeParse(req.query);
    if (!queryResult.success) {
      res.status(400).json({
        message: 'Invalid query parameters',
        errors: queryResult.error.flatten().fieldErrors,
      });
      return;
    }

    const { priority } = queryResult.data;

    let [boardRecord] = await db.select().from(boards).where(eq(boards.id, id));

    // If demo board requested but doesn't exist, try getting first board or return 404
    if (!boardRecord) {
      const [firstBoard] = await db.select().from(boards).limit(1);
      if (firstBoard) {
        boardRecord = firstBoard;
      } else {
        res.status(404).json({ message: 'Board not found' });
        return;
      }
    }

    const boardColumns = await db
      .select()
      .from(columns)
      .where(eq(columns.boardId, boardRecord.id))
      .orderBy(asc(columns.position));

    const columnIds = boardColumns.map((c) => c.id);

    let boardTasksList: Array<typeof tasks.$inferSelect> = [];
    if (columnIds.length > 0) {
      const conditions: SQL[] = [];
      if (priority) {
        conditions.push(eq(tasks.priority, priority));
      }

      boardTasksList = await db
        .select()
        .from(tasks)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(tasks.createdAt));
    }

    // Map tasks to respective columns
    const columnsWithTasks = boardColumns.map((col) => {
      const colTasks = boardTasksList.filter((t) => t.columnId === col.id);
      return {
        ...col,
        tasks: colTasks,
      };
    });

    res.status(200).json({
      message: 'Board details retrieved successfully',
      data: {
        ...boardRecord,
        columns: columnsWithTasks,
      },
    });
  } catch (error: any) {
    console.error('Error fetching board by ID:', error);
    res.status(500).json({
      message: 'Failed to fetch board details',
      error: error?.message || 'Internal Server Error',
    });
  }
}
