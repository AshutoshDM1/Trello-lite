import type { Request, Response } from 'express';
import { eq, asc, desc, and, type SQL } from 'drizzle-orm';
import { z } from 'zod';
import crypto from 'crypto';
import db from '../../utils/db.js';
import { boards, columns, tasks } from '../../db/schema.js';
import { priorityQuerySchema } from '../Task/task.validation.js';

const createBoardSchema = z.object({
  name: z.string().trim().min(1, 'Board name cannot be empty').max(100, 'Board name is too long'),
});

const updateBoardSchema = z.object({
  name: z.string().trim().min(1, 'Board name cannot be empty').max(100, 'Board name is too long'),
});

/**
 * POST /api/v1/boards
 * Create a new board with default columns (To Do, In Progress, Done)
 */
export async function createBoard(req: Request, res: Response): Promise<void> {
  try {
    const parseRes = createBoardSchema.safeParse(req.body);
    if (!parseRes.success) {
      res.status(400).json({
        message: 'Validation failed',
        errors: parseRes.error.flatten().fieldErrors,
      });
      return;
    }

    const { name } = parseRes.data;
    const newBoardId = crypto.randomUUID();

    // 1. Create board
    const [newBoard] = await db
      .insert(boards)
      .values({
        id: newBoardId,
        name,
      })
      .returning();

    // 2. Automatically generate 3 default standard columns
    const defaultCols = [
      { id: crypto.randomUUID(), name: 'To Do', boardId: newBoardId, position: 0 },
      { id: crypto.randomUUID(), name: 'In Progress', boardId: newBoardId, position: 1 },
      { id: crypto.randomUUID(), name: 'Done', boardId: newBoardId, position: 2 },
    ];

    const insertedCols = await db.insert(columns).values(defaultCols).returning();

    res.status(201).json({
      message: 'Board created successfully',
      data: {
        ...newBoard,
        columns: insertedCols,
      },
    });
  } catch (error: any) {
    console.error('Error creating board:', error);
    res.status(500).json({
      message: 'Failed to create board',
      error: error?.message || 'Internal Server Error',
    });
  }
}

/**
 * PATCH /api/v1/boards/:id
 * Rename / update board details
 */
export async function updateBoard(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({ message: 'Board ID is required' });
      return;
    }

    const parseRes = updateBoardSchema.safeParse(req.body);
    if (!parseRes.success) {
      res.status(400).json({
        message: 'Validation failed',
        errors: parseRes.error.flatten().fieldErrors,
      });
      return;
    }

    const [existingBoard] = await db.select().from(boards).where(eq(boards.id, id));
    if (!existingBoard) {
      res.status(404).json({ message: 'Board not found' });
      return;
    }

    const { name } = parseRes.data;

    const [updatedBoard] = await db
      .update(boards)
      .set({
        name,
        updatedAt: new Date(),
      })
      .where(eq(boards.id, id))
      .returning();

    res.status(200).json({
      message: 'Board updated successfully',
      data: updatedBoard,
    });
  } catch (error: any) {
    console.error('Error updating board:', error);
    res.status(500).json({
      message: 'Failed to update board',
      error: error?.message || 'Internal Server Error',
    });
  }
}

/**
 * DELETE /api/v1/boards/:id
 * Delete a board (cascades to delete its columns and tasks)
 */
export async function deleteBoard(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({ message: 'Board ID is required' });
      return;
    }

    const [deletedBoard] = await db.delete(boards).where(eq(boards.id, id)).returning();

    if (!deletedBoard) {
      res.status(404).json({ message: 'Board not found' });
      return;
    }

    res.status(200).json({
      message: 'Board deleted successfully',
      data: deletedBoard,
    });
  } catch (error: any) {
    console.error('Error deleting board:', error);
    res.status(500).json({
      message: 'Failed to delete board',
      error: error?.message || 'Internal Server Error',
    });
  }
}

/**
 * GET /api/v1/boards
 * List all boards with columns and task counts
 */
export async function getBoards(_req: Request, res: Response): Promise<void> {
  try {
    const boardsList = await db.select().from(boards).orderBy(asc(boards.createdAt));
    const allColumns = await db.select().from(columns);
    const allTasks = await db.select().from(tasks);

    const boardsWithMeta = boardsList.map((b) => {
      const bCols = allColumns.filter((c) => c.boardId === b.id);
      const bColIds = bCols.map((c) => c.id);
      const bTasks = allTasks.filter((t) => bColIds.includes(t.columnId));
      return {
        ...b,
        columnsCount: bCols.length,
        tasksCount: bTasks.length,
      };
    });

    res.status(200).json({
      message: 'Boards retrieved successfully',
      data: boardsWithMeta,
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
