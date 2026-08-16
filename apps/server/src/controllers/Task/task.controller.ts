import type { Request, Response } from 'express';
import { eq, desc, and, type SQL } from 'drizzle-orm';
import crypto from 'crypto';
import db from '../../utils/db.js';
import { tasks, columns } from '../../db/schema.js';
import {
  createTaskSchema,
  updateTaskSchema,
  moveTaskSchema,
  priorityQuerySchema,
} from './task.validation.js';

/**
 * GET /api/v1/tasks
 * Fetch tasks with optional priority or columnId filters
 */
export async function getTasks(req: Request, res: Response): Promise<void> {
  try {
    const queryResult = priorityQuerySchema.safeParse(req.query);
    if (!queryResult.success) {
      res.status(400).json({
        message: 'Invalid query parameters',
        errors: queryResult.error.flatten().fieldErrors,
      });
      return;
    }

    const { priority, columnId } = queryResult.data;

    const conditions: SQL[] = [];
    if (priority) {
      conditions.push(eq(tasks.priority, priority));
    }
    if (columnId) {
      conditions.push(eq(tasks.columnId, columnId));
    }

    const tasksList = await db
      .select()
      .from(tasks)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(tasks.createdAt));

    res.status(200).json({
      message: 'Tasks retrieved successfully',
      data: tasksList,
    });
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      message: 'Failed to fetch tasks',
      error: error?.message || 'Internal Server Error',
    });
  }
}

/**
 * POST /api/v1/tasks
 * Create a new task
 */
export async function createTask(req: Request, res: Response): Promise<void> {
  try {
    const validationResult = createTaskSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
      });
      return;
    }

    const { title, description, columnId, priority } = validationResult.data;

    // Verify column exists
    const [existingColumn] = await db.select().from(columns).where(eq(columns.id, columnId));

    if (!existingColumn) {
      res.status(400).json({
        message: 'Invalid columnId',
        errors: { columnId: ['Referenced column does not exist'] },
      });
      return;
    }

    const taskId = `task_${crypto.randomUUID()}`;
    const [newTask] = await db
      .insert(tasks)
      .values({
        id: taskId,
        title,
        description: description || null,
        columnId,
        priority,
      })
      .returning();

    res.status(201).json({
      message: 'Task created successfully',
      data: newTask,
    });
  } catch (error: any) {
    console.error('Error creating task:', error);
    res.status(500).json({
      message: 'Failed to create task',
      error: error?.message || 'Internal Server Error',
    });
  }
}

/**
 * PATCH /api/v1/tasks/:id
 * Update task details (title, description, priority, columnId)
 */
export async function updateTask(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({ message: 'Task ID is required' });
      return;
    }

    const validationResult = updateTaskSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
      });
      return;
    }

    const [existingTask] = await db.select().from(tasks).where(eq(tasks.id, id));

    if (!existingTask) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    const { title, description, columnId, priority } = validationResult.data;

    if (columnId) {
      const [targetColumn] = await db.select().from(columns).where(eq(columns.id, columnId));

      if (!targetColumn) {
        res.status(400).json({
          message: 'Invalid columnId',
          errors: { columnId: ['Referenced column does not exist'] },
        });
        return;
      }
    }

    const updateData: Record<string, any> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (columnId !== undefined) updateData.columnId = columnId;
    if (priority !== undefined) updateData.priority = priority;
    updateData.updatedAt = new Date();

    const [updatedTask] = await db
      .update(tasks)
      .set(updateData)
      .where(eq(tasks.id, id))
      .returning();

    res.status(200).json({
      message: 'Task updated successfully',
      data: updatedTask,
    });
  } catch (error: any) {
    console.error('Error updating task:', error);
    res.status(500).json({
      message: 'Failed to update task',
      error: error?.message || 'Internal Server Error',
    });
  }
}

/**
 * PATCH /api/v1/tasks/:id/move
 * Move a task to a different column
 */
export async function moveTask(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({ message: 'Task ID is required' });
      return;
    }

    const validationResult = moveTaskSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
      });
      return;
    }

    const [existingTask] = await db.select().from(tasks).where(eq(tasks.id, id));

    if (!existingTask) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    const { columnId } = validationResult.data;

    const [targetColumn] = await db.select().from(columns).where(eq(columns.id, columnId));

    if (!targetColumn) {
      res.status(400).json({
        message: 'Invalid target columnId',
        errors: { columnId: ['Target column does not exist'] },
      });
      return;
    }

    const [movedTask] = await db
      .update(tasks)
      .set({
        columnId,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, id))
      .returning();

    res.status(200).json({
      message: 'Task moved successfully',
      data: movedTask,
    });
  } catch (error: any) {
    console.error('Error moving task:', error);
    res.status(500).json({
      message: 'Failed to move task',
      error: error?.message || 'Internal Server Error',
    });
  }
}

/**
 * DELETE /api/v1/tasks/:id
 * Delete a task
 */
export async function deleteTask(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({ message: 'Task ID is required' });
      return;
    }

    const [deletedTask] = await db.delete(tasks).where(eq(tasks.id, id)).returning();

    if (!deletedTask) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    res.status(200).json({
      message: 'Task deleted successfully',
      data: deletedTask,
    });
  } catch (error: any) {
    console.error('Error deleting task:', error);
    res.status(500).json({
      message: 'Failed to delete task',
      error: error?.message || 'Internal Server Error',
    });
  }
}
