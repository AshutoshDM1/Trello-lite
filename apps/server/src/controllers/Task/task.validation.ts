import { z } from 'zod';

export const TASK_PRIORITIES = ['Low', 'Medium', 'High'] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'Task title cannot be empty'),
  description: z.string().optional().nullable(),
  columnId: z.string().trim().min(1, 'Column ID cannot be empty'),
  priority: z.enum(TASK_PRIORITIES).default('Medium'),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1, 'Task title cannot be empty').optional(),
  description: z.string().optional().nullable(),
  columnId: z.string().trim().min(1, 'Column ID cannot be empty').optional(),
  priority: z.enum(TASK_PRIORITIES).optional(),
});

export const moveTaskSchema = z.object({
  columnId: z.string().trim().min(1, 'Target column ID cannot be empty'),
});

export const priorityQuerySchema = z.object({
  priority: z.enum(TASK_PRIORITIES).optional(),
  columnId: z.string().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type MoveTaskInput = z.infer<typeof moveTaskSchema>;
