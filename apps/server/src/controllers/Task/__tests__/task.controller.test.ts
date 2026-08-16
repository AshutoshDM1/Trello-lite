import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';

// Mock DB helper functions
let mockColumnsReturn: any[] = [];
let mockTasksReturn: any[] = [];
let mockInsertReturn: any[] = [];
let mockUpdateReturn: any[] = [];

vi.mock('../../../utils/db.js', () => ({
  default: {
    select: vi.fn().mockImplementation(() => ({
      from: vi.fn().mockImplementation(() => ({
        where: vi.fn().mockImplementation(() => {
          // If columns mock has items, return columns, else tasks
          if (mockColumnsReturn.length > 0) {
            const res = [...mockColumnsReturn];
            mockColumnsReturn = [];
            return Promise.resolve(res);
          }
          const res = [...mockTasksReturn];
          mockTasksReturn = [];
          return Promise.resolve(res);
        }),
        orderBy: vi.fn().mockResolvedValue([]),
      })),
    })),
    insert: vi.fn().mockImplementation(() => ({
      values: vi.fn().mockImplementation(() => ({
        returning: vi.fn().mockImplementation(() => Promise.resolve(mockInsertReturn)),
      })),
    })),
    update: vi.fn().mockImplementation(() => ({
      set: vi.fn().mockImplementation(() => ({
        where: vi.fn().mockImplementation(() => ({
          returning: vi.fn().mockImplementation(() => Promise.resolve(mockUpdateReturn)),
        })),
      })),
    })),
  },
}));

import { createTask, moveTask } from '../task.controller.js';

describe('Task Controller & Validation Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockColumnsReturn = [];
    mockTasksReturn = [];
    mockInsertReturn = [];
    mockUpdateReturn = [];
  });

  it('should reject task creation with an empty title with 400 Bad Request', async () => {
    const req = {
      body: {
        title: '   ',
        columnId: 'col_todo',
        priority: 'High',
      },
    } as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await createTask(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Validation failed',
        errors: expect.objectContaining({
          title: expect.arrayContaining(['Task title cannot be empty']),
        }),
      }),
    );
  });

  it('should reject task creation with invalid priority with 400 Bad Request', async () => {
    const req = {
      body: {
        title: 'Valid Title',
        columnId: 'col_todo',
        priority: 'SuperUrgent',
      },
    } as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await createTask(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Validation failed',
      }),
    );
  });

  it('should reject task creation if referenced column does not exist', async () => {
    mockColumnsReturn = []; // Empty array -> column not found

    const req = {
      body: {
        title: 'Valid Task',
        columnId: 'non_existent_col',
        priority: 'Medium',
      },
    } as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await createTask(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Invalid columnId',
      }),
    );
  });

  it('should move a task to target column successfully', async () => {
    mockTasksReturn = [{ id: 'task_1', title: 'Task 1', columnId: 'col_todo' }];
    mockColumnsReturn = [{ id: 'col_in_progress', name: 'In Progress' }];
    mockUpdateReturn = [{ id: 'task_1', title: 'Task 1', columnId: 'col_in_progress' }];

    const req = {
      params: { id: 'task_1' },
      body: { columnId: 'col_in_progress' },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await moveTask(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Task moved successfully',
        data: expect.objectContaining({ columnId: 'col_in_progress' }),
      }),
    );
  });
});
