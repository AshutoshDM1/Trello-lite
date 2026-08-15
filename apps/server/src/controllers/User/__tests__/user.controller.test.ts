import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';

// Mock dependencies with relative paths
vi.mock('../../../lib/auth.js', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock('../../../utils/db.js', () => ({
  default: {
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockResolvedValue([
        { id: 'user_1', name: 'Admin User', email: 'admin@crm.com', role: 'admin' },
        { id: 'user_2', name: 'Member User', email: 'member@crm.com', role: 'member' },
      ]),
    }),
  },
}));

import { getAllUsers } from '../user.controller.js';
import { auth } from '../../../lib/auth.js';

describe('User Controller & RBAC Permissions (Modular Tests)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should deny non-admin member access with 403 Forbidden', async () => {
    (auth.api.getSession as any).mockResolvedValue({
      user: { id: 'user_2', email: 'member@crm.com', role: 'member' },
    });

    const req = { headers: {} } as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await getAllUsers(req, res, () => {});

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('Forbidden'),
      }),
    );
  });

  it('should allow admin user to fetch full users list', async () => {
    (auth.api.getSession as any).mockResolvedValue({
      user: { id: 'user_1', email: 'admin@crm.com', role: 'admin' },
    });

    const req = { headers: {} } as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await getAllUsers(req, res, () => {});

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ role: 'admin' })]),
    );
  });
});
