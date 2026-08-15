import { describe, it, expect, vi } from 'vitest';
import type { Request, Response } from 'express';
import asyncHandler from '../asyncHandler.js';

describe('asyncHandler Utility (Unit Tests)', () => {
  it('should execute controller handler successfully', async () => {
    const mockHandler = vi.fn().mockResolvedValue(undefined);
    const wrapped = asyncHandler(mockHandler);

    const req = {} as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await wrapped(req, res);

    expect(mockHandler).toHaveBeenCalledWith(req, res);
  });

  it('should catch errors thrown by controller handler and respond with 500 status', async () => {
    const error = new Error('Async database failure');
    const mockHandler = vi.fn().mockRejectedValue(error);
    const wrapped = asyncHandler(mockHandler);

    const req = {} as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await wrapped(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});
